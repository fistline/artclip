Block public access (bucket settings)



Bucket policy

{
    "Version": "2008-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::031918065199:role/vr-lambda-api-role"
            },
            "Action": [
                "s3:GetObject",
                "s3:PutObject",
                "s3:PutObjectAcl"
            ],
            "Resource": "arn:aws:s3:::artclip-input/*"
        },
        {
            "Effect": "Allow",
            "Principal": {
                "AWS": "arn:aws:iam::031918065199:role/vr-lambda-job-role"
            },
            "Action": "s3:GetObject",
            "Resource": "arn:aws:s3:::artclip-input/*"
        }
    ]
}

Cross-origin resource sharing (CORS)


[
    {
        "AllowedHeaders": [
            "*"
        ],
        "AllowedMethods": [
            "HEAD",
            "GET",
            "POST",
            "PUT"
        ],
        "AllowedOrigins": [
            "*"
        ],
        "ExposeHeaders": [
            "x-amz-server-side-encryption",
            "x-amz-request-id",
            "x-amz-id-2",
            "ETag"
        ],
        "MaxAgeSeconds": 3600
    }
]



iam role [artclip-lambda-api-policy]

{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "lambda:ListFunctions",
                "lambda:InvokeFunction",
                "lambda:GetFunction",
                "logs:CreateLogStream",
                "logs:PutLogEvents"
            ],
            "Resource": "*",
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:PutObjectAcl"
            ],
            "Resource": [
                "arn:aws:s3:::artclip-input/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:PutObject",
                "s3:GetObject",
                "s3:ListBucket"
            ],
            "Resource": [
                "arn:aws:s3:::artclip-output",
                "arn:aws:s3:::artclip-output/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "s3:DeleteObject",
                "s3:PutObjectTagging"
            ],
            "Resource": [
                "arn:aws:s3:::artclip-output/*",
                "arn:aws:s3:::artclip-input/*"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:UpdateItem"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-northeast-2:031918065199:table/artclip",
                "arn:aws:s3:::artclip-output"
            ],
            "Effect": "Allow"
        },
        {
            "Action": [
                "dynamodb:PutItem",
                "dynamodb:DeleteItem",
                "dynamodb:GetItem",
                "dynamodb:Scan",
                "dynamodb:Query",
                "dynamodb:UpdateItem",
                "dynamodb:DescribeStream",
                "dynamodb:GetRecords",
                "dynamodb:GetShardIterator",
                "dynamodb:ListStreams"
            ],
            "Resource": [
                "arn:aws:dynamodb:ap-northeast-2:031918065199:table/transaction",
                "arn:aws:dynamodb:ap-northeast-2:031918065199:table/transaction/stream/2020-03-27T04:51:57.204"
            ],
            "Effect": "Allow"
        }
    ]
}