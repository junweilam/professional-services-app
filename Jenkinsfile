pipeline {
    agent {
        docker {
            image 'node:18.12.0'
            args '-p 3000:3000'
        }
    }

    environment {
        CI = 'false'
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
            }
        }

        stage('Clean Workspace') {
                    steps {
                        sh 'rm -rf frontend/build''
                        sh 'cd ./frontend && npm test'
                    }
                }

        stage('Testing') {
            parallel {
                stage('Install react-scripts') {
                    steps {
                        sh 'npm install react-scripts --save-dev'
                    }
                }
                stage('Frontend run build') {
                    steps {
                        sh 'cd ./frontend && npm install'
                        sh 'cd ./frontend && npm start'
                    }
                }
                stage('Frontend run test') {
                    steps {
                        sh 'sleep 120'
                        sh 'cd ./frontend && npm test'
                    }
                }
                // Add stages for backend build and test here if needed.
            }
        }
    }
}
