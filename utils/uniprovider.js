var UniProvider = function (host, timeout) {
    this.host = host || 'http://localhost:8545';
    this.timeout = timeout || 0;
};
/*Sync request*/
UniProvider.prototype.send = async function (payload) {
    const _this = this;
    try {
        var [error, res] = await uni.request({
            url: _this.host,
            data: JSON.stringify(payload),
            method: "POST",
            header: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        throw new Error(error);
    }
    if (error) {
        throw new Error(error);
    }
    return res.data;
};
/*Asynchronous request*/
UniProvider.prototype.sendAsync = function (payload, callback) {
    const _this = this;
    uni.request({
        url: _this.host,
        data: JSON.stringify(payload),
        method: "POST",
        header: {
            'Content-Type': 'application/json'
        },
        success: (res) => {
            callback(null, res.data);
        },
        fail: (res) => {
            throw new Error("request failed: " + res);
        }
    });
};

UniProvider.prototype.isConnected = function () {
    try {
        this.send({
            method: 'Ping',
            params: []
        });
        return true;
    } catch (e) {
        return false;
    }
};

module.exports = UniProvider;
