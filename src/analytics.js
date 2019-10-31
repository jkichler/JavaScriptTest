import https from "https";

/**
 * @property {string|HistoryResponse} source
 */
export default class Analytics {
  constructor(source) {
    this.source = source;
  }

  /**
   * Get events history.
   *
   * @returns {Promise<HistoryResponse>}
   */
  async getHistory() {
    if (typeof this.source === "object") return this.source;
    const getHistoryPromise = url => {
      return new Promise((resolve, reject) => {
        https.get(url, response => {
          let data = "";
          response.on("data", chunck => {
            data += chunck;
          });
          response.on("end", () => {
            resolve(JSON.parse(data));
          });
          response.on("error", error => {
            reject(error);
          });
        });
      });
    };
    try {
      let promise = getHistoryPromise(this.source);
      return promise;
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Get total amount of all validated purchases.
   *
   * @returns {Promise<number>}
   */
  async getTotalPurchasesAmount() {}

  /**
   * Get list of clients who did at least 1 validated purchase.
   *
   * @returns {Promise<string[]>}
   */
  async getClients() {}
}
