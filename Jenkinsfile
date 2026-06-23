pipeline {
    agent any

    environment {
        DOCKER_USER    = "jodyys"
        IMAGE_BACKEND  = "travelapp-backend"
        IMAGE_FRONTEND = "travelapp-frontend"
    }

    stages {
        stage('Checkout') {
            steps {
                git(
                    branch: 'main',
                    credentialsId: 'github-creds',
                    url: 'https://github.com/jodyys/travel-destination-app.git'
                )
            }
        }

        stage('Build Docker Images (Bareng)') {
            parallel {
                stage('Build Backend') {
                    steps {
                        sh """
                        echo "=== Building Backend Image ==="
                        docker build \
                          -t ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER} \
                          -t ${DOCKER_USER}/${IMAGE_BACKEND}:latest \
                          backend
                        """
                    }
                }
                stage('Build Frontend') {
                    steps {
                        sh """
                        echo "=== Building Frontend Image ==="
                        docker build \
                          -t ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER} \
                          -t ${DOCKER_USER}/${IMAGE_FRONTEND}:latest \
                          frontend
                        """
                    }
                }
            }
        }

        stage('Security Scan Trivy (Bareng)') {
            parallel {
                stage('Scan Backend') {
                    steps {
                        sh """
                        echo "=== Scanning Backend Image ==="
                        trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER}
                        """
                    }
                }
                stage('Scan Frontend') {
                    steps {
                        sh """
                        echo "=== Scanning Frontend Image ==="
                        trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER}
                        """
                    }
                }
            }
        }

        stage('Push Images To DockerHub') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-creds',
                        usernameVariable: 'DOCKERHUB_USER',
                        passwordVariable: 'DOCKERHUB_PASS'
                    )
                ]) {
                    sh """
                    echo \$DOCKERHUB_PASS | docker login -u \$DOCKERHUB_USER --password-stdin

                    echo "=== Pushing Backend Images ==="
                    docker push ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER}
                    docker push ${DOCKER_USER}/${IMAGE_BACKEND}:latest
                    
                    echo "=== Pushing Frontend Images ==="
                    docker push ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER}
                    docker push ${DOCKER_USER}/${IMAGE_FRONTEND}:latest

                    docker logout
                    """
                }
            }
        }
    }

    post {
        success {
            echo 'Pipeline Success!'
        }
        failure {
            echo 'Pipeline Failed. Please check the logs.'
        }
        always {
            echo 'Cleaning up dangling Docker images...'
            sh 'docker image prune -af || true'
        }
    }
}