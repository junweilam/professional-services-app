pipeline {
    agent any
    // agent {
    //     docker {
    //         //image 'docker:dind'
    //         image 'node:18.18.2'
    //         args '-p 3000:3000'
    //         //args '-v /var/run/docker.sock:/var/run/docker.sock'
    //     }
    //     // docker {
    //     //     image 'jenkins/inbound-agent'
    //     //     args '-v /var/run/docker.sock:/var/run/docker.sock'
    //     // }
    // }

    // tools {
    //     // Install Docker Compose
    //     node('master') {
    //         tool 'Docker-Compose'
    //     }
    // }


    environment {
        PATH = "/usr/local/bin:${env.PATH}"
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

        stage('Debug') {
            steps {
                sh 'echo $PATH'
                //sh 'ls -1 /usr/local/bin/docker-compose'
            }
        }   

        // stage('Install Docker Compose') {
        //     steps {
        //         sh 'apt-get update'
        //         sh 'apt-get install -y docker-compose'
        //     }
        // }

        // stage('Clean Workspace') {
        //             steps {
        //                 sh 'rm -rf frontend/build'
        //                 sh 'rm -rf frontend/node_modules'
        //                 sh 'rm -rf backend/node_modules'
        //                 sh 'rm -rf node_modules'
        //                 sh 'rm -rf ~/.cache/docker-compose'
        //             }
        //         }

    

        
            

        

        // stage('Set up container') {
        //     steps {
        //         // sh 'docker-compose build'
        //         // sh 'docker-compose up'
        //         sh 'cd ./backend-app && docker-compose -f docker-compose.yml down'
        //         sh 'cd ./backend-app && docker-compose -f docker-compose.yml build'
        //         sh 'cd ./backend-app && docker-compose -f docker-compose.yml up'
                    
        //     }
        // }

        // stage('Set up container') {
        //     steps {
        //         echo 'set up container'
        //         sh''''
        //         docker-compose -f backend-app/docker-compose.yml --build -d
        //         '''
        //         }
        //     }
        
      

        

        stage('Testing') {
            parallel {
                stage('Frontend run build') {
                    agent {
                        docker {
                            image 'node:18.18.2'
                            args '-p 3000:3000'
                        }
                        
                    }
                    steps {
                        sh 'cd ./frontend-app && npm install'
                        sh 'cd ./frontend-app && npm run build'
                        sh 'env'
                    }
                }
                stage('Set up container') {
                    agent any
                    steps {
                        script {
                            echo env.$PATH
                            //sh 'cd ./backend-app && git clean -fd'
                            // sh 'docker-compose build'
                            // sh 'docker-compose up'
                            // sh 'cd ./backend-app && docker-compose down'
                            // sh 'cd ./backend-app && docker-compose -f docker-compose.yml build'
                            sh 'cd ./backend-app && docker compose -f docker-compose.yml up --build -d'
                            
                        }
                    }
                }
                // stage('Backend Docker Build and Up') {
                //     steps {
                //         script { 
                            
                //             dir('backend-app/') {
                //             sh 'npm test'
                //             }
                //         }
                //     }
                // }
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
