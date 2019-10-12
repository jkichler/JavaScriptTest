import {expect} from 'chai'
import 'deep-eql'
import Analytics from '../src/analytics'
import historyMock from './history-api-mock.json'

describe('Analytics', () => {
    describe('.getHistory()', () => {
        it('should be able to get history from a URL', async function () {
            this.timeout(5000)

            const analytics = new Analytics('https://raw.githubusercontent.com/OVNICap/JavaScriptTest/master/test/history-api-mock.json')
            const history = await analytics.getHistory()

            expect(history).eql(historyMock)
        })

        it('should be able to get history from an object', async () => {
            const analytics = new Analytics(historyMock)
            const history = await analytics.getHistory()

            expect(history).eql(historyMock)
        })
    })

    describe('.getTotalPurchasesAmount()', () => {
        it('should be able to get total amount of buy actions', async () => {
            const analytics = new Analytics(historyMock)
            const clients = await analytics.getTotalPurchasesAmount()

            expect(clients).equal(58.2)
        })
    })

    describe('.getClients()', () => {
        it('should be able to get list of ', async () => {
            const analytics = new Analytics(historyMock)
            const clients = await analytics.getClients()

            expect(clients).eql(['Bob', 'David'])
        })
    })

    describe('.getClientStats()', () => {
        it('should return an iterable list of stats for each client', async () => {
            const analytics = new Analytics(historyMock)
            const clientStats = await analytics.getClientStats()
            const result = []

            expect(clientStats).not.instanceOf(Array, 'an Iterable<UserStats> is expected')

            for await (const {clientName, stats} of clientStats) {
                result.push([clientName, stats])
            }

            expect(result).eql([
                [
                    'Bob',
                    {
                        averageCart: 19.9,
                        buyRate: 0.6,
                    },
                ],
                [
                    'David',
                    {
                        averageCart: 18.4,
                        buyRate: 1,
                    },
                ],
                [
                    'Ana',
                    {
                        averageCart: 0,
                        buyRate: 1,
                    },
                ],
                [
                    'Craig',
                    {
                        averageCart: 0,
                        buyRate: 0,
                    },
                ],
            ])
        })
    })
})
