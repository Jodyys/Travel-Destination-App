pipeline {
    agent any

    environment {
        DOCKER_USER    = "jodyys"
        IMAGE_BACKEND  = "travelapp-backend"
        IMAGE_FRONTEND = "travelapp-frontend"
    }

    tools {
        // Menggunakan tipe data 'sonarRunner' yang sesuai dengan sistem Jenkins Anda
        sonarRunner 'SonarQube-Scanner'
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
    
        stage('SonarQube Scan') {
            steps {
                withSonarQubeEnv('SonarQube') {
                    // Menjalankan biner scanner yang sudah didefinisikan secara global
                    sh 'sonar-scanner -Dsonar.projectKey=travel-app -Dsonar.sources=.'
                }
            }
        }

        stage('Quality Gate') {
            steps {
                timeout(time: 5, unit: 'MINUTES') {
                    waitForQualityGate abortPipeline: true
                }
            }
        }

        stage('Secret Scanning Gitleaks') {
            steps {
                echo "=== Scanning for Secret Leaks ==="
                sh 'gitleaks detect --source=. --verbose --report-path=gitleaks-result.json --exit-code 0 || true'
                echo "=== Scan Selesai, Hasil disimpan di gitleaks-result.json ==="
            }
        }

        stage('SCA Scan Trivy') {
            steps {
                echo "=== Task 1: SCA Scan Backend Dependencies ==="
                sh 'trivy fs --severity HIGH,CRITICAL backend/'

                echo "=== Task 2: SCA Scan Frontend Dependencies ==="
                sh 'trivy fs --severity HIGH,CRITICAL frontend/'
            }
        }

        stage('Build Docker Images') {
            steps {
                echo "=== Task 1: Building Backend Image ==="
                sh "docker build -t ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER} -t ${DOCKER_USER}/${IMAGE_BACKEND}:latest backend"

                echo "=== Task 2: Building Frontend Image ==="
                sh "docker build -t ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER} -t ${DOCKER_USER}/${IMAGE_FRONTEND}:latest frontend"
            }
        }

        stage('Security Scan Image Trivy') {
            steps {
                echo "=== Task 1: Scanning Backend Image ==="
                sh "trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER}"

                echo "=== Task 2: Scanning Frontend Image ==="
                sh "trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER}"
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
        always {
            echo 'Cleaning up dangling Docker images...'
            sh 'docker image prune -af || true'
            
            echo 'Archiving Gitleaks artifacts...'
            archiveArtifacts artifacts: 'gitleaks-result.json', allowEmptyArchive: true
        }
        success {
            echo 'Pipeline Success!'
        }
        failure {
            echo 'Pipeline Failed. Please check the logs.'
        }
    }
}