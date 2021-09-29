module.exports = {
    ci: {
        collect: {
            settings: {
                chromeFlags: "--ignore-certificate-errors",
                skipAudits: ['uses-http2']
            },
            numberOfRuns: 3,
            url: [
                "http://127.0.0.1:3000/",
            ]
        },
        upload: {
            //     target: "lhci",
            //     serverBaseUrl: "https://lit-ocean-90649.herokuapp.com/",
            //     token: process.env.LHCI_SERVER_TOKEN
            target: 'temporary-public-storage',
        }
    }
};