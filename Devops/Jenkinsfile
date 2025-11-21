pipeline {
    agent { label 'slave1' }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/Tatanagasai20/hack.git'
            }
        }

        stage('Maven Build Backend') {
            steps {
                dir('backend_java') {
                    sh '''
                        
                        mvn clean package 
                    '''
                }
            }
        }

        stage('Stop & Remove Containers + Volumes') {
            steps {
                sh 'docker compose down --volumes --remove-orphans || true'
            }
        }

        stage('Remove ALL Docker Images') {
            steps {
                sh 'docker image prune -a --force'
            }
        }

        stage('Build Fresh Images & Start Containers') {
            steps {
                sh 'docker compose build --no-cache --force-rm'
                sh 'docker compose up -d'
            }
        }
    }

    post {
        success {
            echo 'Deployment completed successfully! Everything is fresh and running.'
        }
        failure {
            echo 'Deployment failed. Check the logs above.'
        }
        always {
            echo 'Pipeline finished.'
        }
    }
}
