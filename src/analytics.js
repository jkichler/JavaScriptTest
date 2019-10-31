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
  async getTotalPurchasesAmount() {
    const data = await this.getHistory();
    const reducer = (accum, value) => accum + value;
    let total = data.history
      .filter(el => el.action === "buy")
      .filter(el => el.details.validated === true)
      .map(el => el.details.amount / 100);
    return Number(Math.round(total.reduce(reducer, 0) + "e1") + "e-1");
  }

  /**
   * Get list of clients who did at least 1 validated purchase.
   *
   * @returns {Promise<string[]>}
   */
  async getClients() {
    const data = await this.getHistory();
    let clients = {};
    data.history
      .filter(el => el.action === "buy")
      .forEach(client => {
        if (client.details.validated) {
          if (!clients[client.user]) {
            clients[client.user] = true;
          }
        }
      });
    return Object.keys(clients).sort();
  }
  async getClientStats() {
    //using object to store date over array as array key check is constant time operation, Trading space for performance
    let clientStats = {};
    let data = await this.getHistory();
    data.history.forEach(client => {
      if (!clientStats[client.user]) {
        clientStats[client.user] = {
          clientName: client.user,
          stats: { averageCart: 0, buyRate: 0 },
          count: 0,
          purchases: 0,
          total: 0,
          carts: 0
        };
      }
      clientStats[client.user].count++;
      if (client.action === "buy") {
        clientStats[client.user].carts++;
        if (client.details.validated) {
          clientStats[client.user].purchases++;
          clientStats[client.user].total += client.details.amount / 100;
          clientStats[client.user].stats.averageCart =
            clientStats[client.user].total / clientStats[client.user].purchases;
        }
        clientStats[client.user].stats.buyRate = Number(
          Math.floor(
            clientStats[client.user].carts / clientStats[client.user].count +
              "e1"
          ) + "e-1"
        );
      }
    });
    const interableStats = obj => {
      let statsArray = [];
      for (let key in obj) {
        statsArray.push({
          clientName: obj[key].clientName,
          stats: obj[key].stats
        });
      }
      let idx = 0;
      const asyncIterator = {
        next: () => {
          if (idx >= statsArray.length) {
            return Promise.resolve({ done: true });
          }
          const value = statsArray[idx++];
          return Promise.resolve({ value, done: false });
        }
      };
      const asyncIterable = {
        [Symbol.asyncIterator]: () => asyncIterator
      };
      return asyncIterable;
    };
    return interableStats(clientStats);
  }
}
