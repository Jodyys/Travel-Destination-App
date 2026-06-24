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

    stage('Secret Scanning Gitleaks') {
        steps {
            sh """
            echo "=== Scanning for Secret Leaks ==="
        
            # 1. Jalankan gitleaks dengan output terpisah ke file JSON
            # 2. Hapus --no-git agar gitleaks bisa membaca history commit (lebih akurat)
            # 3. Tetap gunakan --exit-code 0 jika kamu tidak ingin memutus build saat ada leak
        
            gitleaks detect --source=. --verbose --report-path=gitleaks-result.json --exit-code 0
        
            echo "=== Scan Selesai, Hasil disimpan di gitleaks-result.json ==="
            """
}
    post {
        always {
            // Mengarsipkan hasil scan agar bisa kamu download/baca di Jenkins Dashboard
            archiveArtifacts artifacts: 'gitleaks-result.json', allowEmptyArchive: true
        }
    }
}

        stage('SCA Scan Trivy') {
            steps {
                sh """
                echo "=== Task 1: SCA Scan Backend Dependencies ==="
                trivy fs --severity HIGH,CRITICAL backend/

                echo "=== Task 2: SCA Scan Frontend Dependencies ==="
                trivy fs --severity HIGH,CRITICAL frontend/
                """
            }
        }

        stage('Build Docker Images') {
            steps {
                sh """
                echo "=== Task 1: Building Backend Image ==="
                docker build -t ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER} -t ${DOCKER_USER}/${IMAGE_BACKEND}:latest backend

                echo "=== Task 2: Building Frontend Image ==="
                docker build -t ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER} -t ${DOCKER_USER}/${IMAGE_FRONTEND}:latest frontend
                """
            }
        }

        stage('Security Scan Image Trivy') {
            steps {
                sh """
                echo "=== Task 1: Scanning Backend Image ==="
                trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_BACKEND}:v${env.BUILD_NUMBER}

                echo "=== Task 2: Scanning Frontend Image ==="
                trivy image --severity HIGH,CRITICAL ${DOCKER_USER}/${IMAGE_FRONTEND}:v${env.BUILD_NUMBER}
                """
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