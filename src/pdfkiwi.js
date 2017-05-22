class Pdfkiwi {
    constructor(apiUser, apiKey) {
        if (!apiUser || !apiKey) {
            throw new Error(`Incomplete Pdf.kiwi API credentials.`);
        }

        this.apiUser = apiUser;
        this.apiKey  = apiKey;
    }
}

module.exports = Pdfkiwi;
