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
  async getHistory() {}

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
