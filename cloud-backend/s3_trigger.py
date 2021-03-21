import json
import uuid
import os
import time
import urllib.parse
from urllib import parse
import traceback
import subprocess

from misc import get_table

import os
from io import BytesIO
import boto3
from boto3.dynamodb.conditions import Key
# from PIL import Image
# import PIL.Image




# SIGNED_URL_EXPIRATION = 300

# def get_signed_url(expires_in, bucket, obj):
#     """
#     Generate a signed URL
#     :param expires_in:  URL Expiration time in seconds
#     :param bucket:
#     :param obj:         S3 Key name
#     :return:            Signed URL
#     """
#     s3_cli = boto3.client("s3")
#     presigned_url = s3_cli.generate_presigned_url('get_object', Params={'Bucket': bucket, 'Key': obj},
#                                                   ExpiresIn=expires_in)
#     return presigned_url

def convert_video(event, context):

    table = get_table()
    print('event', json.dumps(event))

    sourceS3Bucket = event['Records'][0]['s3']['bucket']['name']
    sourceS3Key = event['Records'][0]['s3']['object']['key']
    sourceS3Key = urllib.parse.unquote(sourceS3Key)

    # mediaConvertRole = get_mediaconvert_role()
    mediaConvertRole = 'arn:aws:iam::129219767314:role/artclip-mediaconvert-job-role'
    region = 'ap-northeast-2'

    print('sourceS3Bucket', sourceS3Bucket)
    print('sourceS3Key', sourceS3Key)
    print('mediaConvertRole', mediaConvertRole)
    print('region', region)

    statusCode = 200
    body = {}
    item = job = None
    mediainfo = None

    try:

        response = table.scan(
            FilterExpression=Key('title').eq(sourceS3Key)
        )

        print('Items', response['Items'])
        
        for item in response['Items']:
            item['status'] = "transcoding"
            
        create_job(sourceS3Bucket=sourceS3Bucket,
                    sourceS3Key=sourceS3Key,
                    mediaConvertRole=mediaConvertRole,
                    region=region,
                    table=table,
                    item=item)
        # else:
        #     resize_image(sourceS3Bucket=sourceS3Bucket,
        #                  sourceS3Key=sourceS3Key,
        #                  size='120x120')


        body = {'success': True}

    except Exception as ex:
        print('Exception', traceback.format_exc())
        print('item', item)
        try:
            item['status'] = "error while transcoding"
            item['message'] = traceback.format_exc()
            result = table.put_item(Item=item)
        except Exception as ex:
            print('table Exception',ex)
        statusCode = 500
        body = {'error': str(ex)}
        raise

    finally:
        return {
            'statusCode': statusCode,
            'body': json.dumps(body),
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        }



def create_job(sourceS3Bucket, sourceS3Key,  mediaConvertRole, region, table, item):

    # sourceS3Key = parse.urlencode(sourceS3Key, doseq=True)
    destinationS3 = 's3://artclip-output/' + sourceS3Key + '/'
    # get_config("videos", "outputBucket") + '/' + sourceS3Key + '/'
    

    # mediainfo YGL
    mediainfo = item['mediainfo']['media']['track']

    print('mediainfo:::', mediainfo)
    media_width = mediainfo[1]['Width']
    media_height = mediainfo[1]['Height']
    fps = int(float(mediainfo[1]['FrameCount']) / float(mediainfo[1]['Duration']))
    
    # print('mediainfo', media_width, media_height,  mediainfo[1]['FrameCount'], mediainfo[1]['Duration'], fps)

    # Use MediaConvert SDK UserMetadata to tag jobs with the assetID
    # Events from MediaConvert will have the assetID in UserMedata
    jobMetadata = {'assetID': str(uuid.uuid4())}

    # get the account-specific mediaconvert endpoint for this region
    mc_client = boto3.client('mediaconvert', region_name=region)
    endpoints = mc_client.describe_endpoints()
    # print('endpoints', endpoints)
    # add the account-specific endpoint to the client session
    client = boto3.client('mediaconvert', region_name=region,
                            endpoint_url=endpoints['Endpoints'][0]['Url'], verify=False)

    # Job settings are in the lambda zip file in the current working directory
    with open('job.json') as json_data:
        jobSettings = json.load(json_data)

    # Update the job settings with the source video from the S3 event and destination
    # paths for converted videos
    
    # video 
    outputs = []
    output_list = jobSettings["OutputGroups"][0]['Outputs']

    width = int(media_width)
    height = int(media_height)
    media_size = int(media_width) * int(media_height)


    # time
    jobSettings["Inputs"][0]['InputClippings'][0]['StartTimecode']
    jobSettings["Inputs"][0]['InputClippings'][0]['EndTimecode']

    jobSettings["Inputs"][0]['ImageInserter']['InsertableImages'][0]['ImageX'] = width - 125
    jobSettings["Inputs"][0]['ImageInserter']['InsertableImages'][0]['ImageY'] = height - 20
    
    # out_cnt = float(mediainfo[1]['Duration'])) / 30000.0


    output['VideoDescription']['Width'] = width
    output['VideoDescription']['Height'] = height
    MaxBitrate = width * height * fps * 0.16
    output['VideoDescription']['CodecSettings']['H265Settings']['MaxBitrate'] = int(MaxBitrate)

    # thumbnails 
    jobSettings["OutputGroups"][1]['Outputs'][0]['VideoDescription']['Width'] = int(media_width)
    jobSettings["OutputGroups"][1]['Outputs'][0]['VideoDescription']['Height'] = int(media_height)

    # thumbnail
    basewidth = 300
    wpercent = (basewidth / float(media_width))
    hsize = int((float(media_height) * float(wpercent)))
    if (hsize % 2) != 0:
       hsize = hsize - 1
    jobSettings["OutputGroups"][2]['Outputs'][0]['VideoDescription']['Width'] = basewidth
    jobSettings["OutputGroups"][2]['Outputs'][0]['VideoDescription']['Height'] = hsize

    print('outputs:')
    print(json.dumps(outputs))

    jobSettings["OutputGroups"][0]['Outputs'] = outputs
    jobSettings["Inputs"][0]['FileInput'] = 's3://' + sourceS3Bucket + '/' + sourceS3Key
    jobSettings["OutputGroups"][0]['OutputGroupSettings']['CmafGroupSettings']['Destination'] = destinationS3
    jobSettings["OutputGroups"][1]['OutputGroupSettings']['FileGroupSettings']['Destination'] = destinationS3 + 'thumbnails/'
    jobSettings["OutputGroups"][2]['OutputGroupSettings']['FileGroupSettings']['Destination'] = destinationS3 + 'thumbnail/'

    print('jobSettings:')
    print(json.dumps(jobSettings))

    # Convert the video using AWS Elemental MediaConvert
    job = client.create_job(Role=mediaConvertRole, UserMetadata=jobMetadata, Settings=jobSettings)
    print('job', json.dumps(job, default=str))

    item['job_id'] = job['Job']['Id']
    item['updated_at'] = int(time.time())

    print('item', item)
    result = table.put_item(Item=item)

    return 


def update_video_status(event, context):
    table = get_table()

    job_id = event['detail']['jobId']
    job_status = event['detail']['status']

    print('event', event)
    print('job_id', job_id)
    print('job_status', job_status)

    statusCode = 200
    body = {}
    item = None

    try:

        response = table.scan(
            FilterExpression=Key('job_id').eq(job_id)
        )

        for item in response['Items']:
            if job_status == "COMPLETE":
                item['status'] = "ready"
            elif job_status == "ERROR":
                item['status'] = "error while transcoding"
            item['updated_at'] = int(time.time())

        if job_status == "COMPLETE":
            bucket ='artclip-output'
            item['event'] = event
            filePath = item['event']['detail']['outputGroupDetails'][2]['outputDetails'][0]['outputFilePaths'][0]
            path = filePath.replace('s3://{}/'.format(bucket), '')
            item['thumbnail'] = path

            content_id = item['id']
            # update_member(content_id, path)
            print(content_id, path)

        print('item', item)
        result = table.put_item(Item=item)

        body = {'success': True}

    except Exception as ex:
        print('Exception', traceback.format_exc())
        print('item', item)
        try:
            item['status'] = "error while transcoding"
            item['message'] = traceback.format_exc()
            result = table.put_item(Item=item)
        except Exception as ex:
            print('table Exception',ex)
        statusCode = 500
        body = {'error': str(ex)}
        raise

    finally:
        return {
            'statusCode': statusCode,
            'body': json.dumps(body),
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'}
        }



def resize_image(sourceS3Bucket, sourceS3Key, size):
    lambdas = boto3.client('lambda')

    payload = {"S3Bucket": sourceS3Bucket, "S3Key": sourceS3Key}
    response = lambdas.invoke(
        FunctionName='media-dev-image_resize', InvocationType='RequestResponse', Payload=json.dumps(payload))
    payload = response['Payload'].read()
    print(payload)

    return 
