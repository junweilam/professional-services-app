pipeline {
    agent {
        docker {
            image 'node:18.12.0'
            args '-p 3000:3000'
        }
    }

    script {
    sh 'curl -L "https://github.com/docker/compose/releases/download/1.29.2/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose'
    sh 'chmod +x /usr/local/bin/docker-compose'
    }

    environment {
        CI = 'false'
        PATH = "$PATH:/usr/bin/docker-compose"
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


        // stage('Set up container') {
        //     steps {
        //         script {
        //             // sh 'docker-compose build'
        //             // sh 'docker-compose up'
        //             sh 'cd ./backend-app && docker-compose -f docker-compose.yml down'
        //             sh 'cd ./backend-app && docker-compose -f docker-compose.yml build'
        //             sh 'cd ./backend-app && docker-compose -f docker-compose.yml up'
                    
        //         }
        //     }
        // }

        stage('Set up container') {
            steps {
                // sh 'docker-compose build'
                // sh 'docker-compose up'
                sh 'cd ./backend-app && docker-compose -f docker-compose.yml down'
                sh 'cd ./backend-app && docker-compose -f docker-compose.yml build'
                sh 'cd ./backend-app && docker-compose -f docker-compose.yml up'
                    
            }
        }

        // stage('Set up container') {
        //     steps {
        //         echo 'set up container'
        //         sh''''
        //         docker-compose -f backend-app/docker-compose.yml --build -d
        //         '''
        //         }
        //     }
        stage('Clean Workspace') {
                    steps {
                        sh 'rm -rf frontend/build'
                    }
                }
        
        // stage('Install react-scripts') {
        //             steps {
        //                 sh 'npm install react-scripts --save-dev'
        //             }
        //         }

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
                            sh 'npm test'
                            }
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
    

    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
    }
}
