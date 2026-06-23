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

        stage('Build & Scan Images') {
            parallel {
                stage('Backend: Build & Scan') {
                    steps {
                        sh """
                        echo "=== Building Backend Image ==="
                        docker build \
                          -t ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER} \
                          -t ${DOCKER_USER}/${IMAGE_BACKEND}:latest \
                          backend

                        echo "=== Scanning Backend Image with Trivy ==="
                        trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER}
                        """
                    }
                }
                stage('Frontend: Build & Scan') {
                    steps {
                        sh """
                        echo "=== Building Frontend Image ==="
                        docker build \
                          -t ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER} \
                          -t ${DOCKER_USER}/${IMAGE_FRONTEND}:latest \
                          frontend

                        echo "=== Scanning Frontend Image with Trivy ==="
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