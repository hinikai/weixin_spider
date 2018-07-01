var fs = require('fs');
fs.writeFile('./output/weixin_list.txt', "");

function showList(list) {
    console.log(list);
    list.list.forEach((item, key) => {
        if (item.app_msg_ext_info) {
            console.log('标题', item.app_msg_ext_info.title);
            console.log('链接', item.app_msg_ext_info.content_url);
            console.log('\n');
            // console.log(item.app_msg_ext_info.multi_app_msg_item_list);
            if (item.app_msg_ext_info.multi_app_msg_item_list.length > 0) {
                console.log('多个文章', item.app_msg_ext_info.multi_app_msg_item_list.length);
            }
            fs.appendFile('./output/weixin_list.txt', item.app_msg_ext_info.content_url + "\n", function(err) {
                if (err) {
                    // console.log('写文件操作失败');
                } else {
                    console.log('写文件操作成功');
                }
            });
        } else {
            console.log(item);
        }
    });
}

module.exports = {
    summary: '抓取微信公众号文章列表',
	*beforeDealHttpsRequest(requestDetail) {
		//console.log('beforeDealHttpsRequest');
		return true;
	},
    *beforeSendRequest(requestDetail) {
		//console.log('beforeSendRequest');
    },
    *beforeSendResponse(requestDetail, responseDetail) {
		//console.log('beforeSendResponse');
        if (requestDetail.url.indexOf('profile_ext') > 0) {
            try {
                let bodyjson = JSON.parse(responseDetail.response.body);
                if (bodyjson && bodyjson.general_msg_list) {
                    let general_msg_list = JSON.parse(bodyjson.general_msg_list);
                    showList(general_msg_list);
                }
            } catch(e) {
                let reg = /var msgList = '(.*)'/;
                let res = reg.exec(responseDetail.response.body);
                if (res) {
                    // console.log(responseDetail.response.body + '');
                    let text = res[1].replace(/&quot;/g, '"');
                    text = text.replace(/\\\\/g, '');
                    let json = JSON.parse(text)
                    showList(json);
                }
            }
        }
    },
	onError(requestDetail, error) {
        console.log('onError', error);
	},
	onConnectError(requestDetail, error) {
		console.log('error', error);
	}
};
