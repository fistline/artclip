import boto3
import json
import decimal
from config import get_config

from sqlalchemy import desc, asc
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from datetime import datetime

import os
import uuid
import boto3
dynamodb = boto3.resource('dynamodb')



def update_member(content_id, path):

    try:
        print('content_id', content_id)
        print('path', path)
        
    except Exception as ex:
        print('Exception', ex)
       
        return None
    finally:
       print('finally')



def get_table():
    table_name = 'artclip'
    dynamodb = boto3.resource('dynamodb')
    return dynamodb.Table(table_name)




def generate_s3_presigned_url(method, bucket, key):
    s3 = boto3.client('s3')
    print(key)
    return s3.generate_presigned_url(
        ClientMethod=method,
        Params={
            'Bucket': bucket,
            'Key': key
        }
    )



def removeEmptyString(dic):
    if isinstance(dic, str):
        if dic == "":
            return None
        else:
            return dic

    for e in dic:
        if isinstance(dic[e], dict):
            dic[e] = removeEmptyString(dic[e])
        if (isinstance(dic[e], str) and dic[e] == ""):
            dic[e] = None
        if isinstance(dic[e], list):
            for entry in dic[e]:
                removeEmptyString(entry)
    return dic
