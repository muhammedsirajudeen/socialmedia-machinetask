provider "aws" {
  region = "ap-south-1"  # Mumbai region
}

# S3 Bucket for Profile Media
resource "aws_s3_bucket" "profile_media" {
  bucket = "profile-media-storage-muhammedsirajudeen"

  tags = {
    Name = "ProfileMediaBucket"
    Environment = "Dev"
  }
}

# Enable Versioning for S3
resource "aws_s3_bucket_versioning" "versioning_example" {
  bucket = aws_s3_bucket.profile_media.id
  versioning_configuration {
    status = "Enabled"
  }
}

# S3 Public Access Block (Security Best Practices)
resource "aws_s3_bucket_public_access_block" "public_access" {
  bucket = aws_s3_bucket.profile_media.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# S3 Lifecycle Policy - Move old objects to Standard-IA
resource "aws_s3_bucket_lifecycle_configuration" "lifecycle" {
  bucket = aws_s3_bucket.profile_media.id

  rule {
    id = "move-to-infrequent-access"
    status = "Enabled"

    transition {
      days = 30
      storage_class = "STANDARD_IA"
    }
  }
}

# EC2 Key Pair
resource "aws_key_pair" "deployer" {
  key_name   = "your-key-name"
  public_key = file("~/.ssh/id_rsa.pub")  # Update with your actual SSH key path
}

# Security Group for EC2 (Allow SSH and HTTP)
resource "aws_security_group" "ec2_sg" {
  name        = "ec2_sg"
  description = "Allow SSH and HTTP traffic"

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# Free Tier EC2 Instance (t2.micro)
resource "aws_instance" "web" {
  ami           = "ami-0ded8326293d3201b"  # Amazon Linux 2 in Mumbai
  instance_type = "t2.micro"
  key_name      = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.ec2_sg.name]

  tags = {
    Name = "FreeTierInstance"
  }
}
