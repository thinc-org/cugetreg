module.exports = {
    ci: {
        collect: {
            settings: {
                chromeFlags: "--ignore-certificate-errors",
                skipAudits: ['uses-http2']
            },
            numberOfRuns: 3,
            url: [
                "http://127.0.0.1:3000/S/schedule",
                "http://127.0.0.1:3000/S/courses",
                "http://127.0.0.1:3000/S/courses/2021701",
            ],
            startServerCommand: "yarn start"
        },
        upload: {
            target: "lhci",
            serverBaseUrl: "https://lighthouse.cugetreg.com/",
            token: process.env.LHCI_SERVER_TOKEN
        }
    }
};