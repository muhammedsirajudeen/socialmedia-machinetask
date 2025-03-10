provider "aws" {
  region = "ap-south-1" # Mumbai region
}


# EC2 Key Pair
resource "aws_key_pair" "deployer" {
  key_name   = "muhammedsirajudeen"
  public_key = file("~/.ssh/id_rsa.pub") # Update with your actual SSH key path
}

# Security Group for EC2 (Allow SSH and HTTP)
# Security Group for EC2 (Allow SSH, HTTP, and HTTPS)
resource "aws_security_group" "ec2_sg" {
  name        = "ec2_sg"
  description = "Allow SSH, HTTP, and HTTPS traffic"

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

  ingress {
    from_port   = 443
    to_port     = 443
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
# Free Tier EC2 Instance (t2.micro) with Ubuntu OS
resource "aws_instance" "web" {
  ami             = "ami-0f5ee92e2d63afc18" # Ubuntu 22.04 LTS in Mumbai
  instance_type   = "t2.micro"
  key_name        = aws_key_pair.deployer.key_name
  security_groups = [aws_security_group.ec2_sg.name]

  # Configure Root Volume with 28GB of storage
  root_block_device {
    volume_size           = 28    # 28GB of storage
    volume_type           = "gp3" # General Purpose SSD (gp3 is recommended, or use gp2)
    delete_on_termination = true  # Delete volume when instance is terminated
  }

  tags = {
    Name = "UbuntuInstance"
  }
}



output "instance_public_ip" {
  description = "Public IP of the EC2 instance"
  value       = aws_instance.web.public_ip
}

output "instance_id" {
  description = "ID of the EC2 instance"
  value       = aws_instance.web.id
}
