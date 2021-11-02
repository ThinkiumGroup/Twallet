import request from "../utils/request";

export default {
  demoRequest(data) {
    return request({
      url: '',
      methods: 'POST',
      data,
    })
  },
}