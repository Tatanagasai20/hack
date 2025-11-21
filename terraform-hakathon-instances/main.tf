resource "aws_instance" "jenkins" {
    ami           = "ami-0ffb57b61228fc1fd" 
    instance_type = "t2.medium"
    key_name      = "key1"
    subnet_id     = "subnet-0ae1ec163225fd3ba"
    vpc_security_group_ids = [ "sg-06e72f526f084a2ae" ]

    
    tags = {
        Name = "JenkinsServer"
    }
  
}