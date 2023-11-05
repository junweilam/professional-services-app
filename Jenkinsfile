pipeline {
    agent {
        docker {
            image 'node:18.12.0'
            args '-p 3000:3000'
        }
    }

    environment {
        CI = 'false'
        // DB_HOST= credentials('DB_HOST') 
        // DB_USER= credentials('DB_USER')
        // DB_PASSWORD= credentials('DB_PASSWORD') 
        // DB_NAME= credentials('DB_NAME')
        // DB_PORT= credentials('DB_PORT') 
        // JWT_SECRET_KEY= credentials('JWT_SECRET_KEY')
        // STRIPE_KEY= credentials('STRIPE_KEY') 
        // CLIENT_URL = credentials('CLIENT_URL')
    }

    stages {
        stage('Verify Workspace') {
            steps {
                dir('frontend-app/') {
                    script {
                        if (!fileExists('package.json')) {
                            error('Missing package.json in the workspace.')
                        }
                    }
                }
                dir('backend-app/') {
                    script {
                        if (!fileExists('package.json')) {
                            error('Missing package.json in the workspace.')
                        }
                    }
                }
            }
        }

        stage('Clean Workspace') {
                    steps {
                        sh 'rm -rf frontend/build'
                    }
                }
        
        stage('Install react-scripts') {
                    steps {
                        sh 'npm install react-scripts --save-dev'
                    }
                }

        stage('Testing') {
            parallel {
                
                stage('Frontend run build') {
                    steps {
                        sh 'cd ./frontend-app && npm install'
                        sh 'cd ./frontend-app && npm start'
                        sh 'env'
                    }
                }
                stage('Backend Docker Build and Up') {
                    steps {
                        script { 
                            dir('backend-app/') {
                                sh 'docker compose -f docker-compose.yml down'
                                sh 'docker compose -f docker-compose.yml build'
                                sh 'docker compose -f docker-compose.yml up --detach --force-recreate --renew-anon-volumes;'
                            }
                        }
                    }
                }
            }
            
            stage('OWASP DependencyCheck') {
                steps {
                    dependencyCheck additionalArguments: '--format HTML --format XML', odcInstallation: 'OWASP Dependency-Check Vulnerabilities'
                }
            }
        }
    }
    

    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
    }
}
