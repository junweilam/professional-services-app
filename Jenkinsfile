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
        stage('Testing'){
            parallel{
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
                stage('Frontend run build') {
                    steps {
                        sh 'sleep 120'
                        sh 'cd ./frontend && npm test'
                    }
                }
            }
        
        

        // stage('Backend run build') {
        //     steps {
        //         dir('backend-app/') {
        //                 sh 'npm install'
        //                 sh 'npm run dev'
        //             }
        //     }
        // }
        // stage('Backend run test') {
        //     steps {
        //         dir('backend-app/') {
        //                 sh 'npm test'
        //             }
        //     }
        // }
        // stage('Frontend run test') {
        //     steps {
        //         dir('frontend-app/') {
        //                 sh 'npm test'
        //             }
        //     }
        // }
        // stage('Deliver') {
        //     steps {
        //         sh './jenkins/scripts/deliver.sh'
        //         input message: 'Finished using the web site? (Click "Proceed" to continue)'
        //         sh './jenkins/scripts/kill.sh'
        //     }
        // }
    }
}
