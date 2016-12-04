function hasClass(elements, cName) {
    return !!elements.className.match(new RegExp("(\\s|^)" + cName + "(\\s|$)"));
};

function addClass(elements, cName) {
    if (!hasClass(elements, cName)) {
        elements.className += " " + cName;
    };
};

function removeClass(elements, cName) {
    if (hasClass(elements, cName)) {
        elements.className = elements.className.replace(new RegExp("(\\s|^)" + cName + "(\\s|$)"), " ");
    };
};

var pagination = {
    paginationid: 'pagination', //divID
    pno: 1, //当前页码
    total: 1, //总页码
    totalRecords: 0, //总数据条数
    gopageWrapId: 'pagination_gopage_wrap',
    gopageButtonId: 'pagination_btn_go',
    gopageTextboxId: 'pagination_btn_go_input',
    getLink: function (n) {
        
    },
    //跳转框得到输入焦点时
    focusGopage: function () {
        var btnGo = document.getElementById(this.gopageButtonId);
        var btnTb = document.getElementById(this.gopageTextboxId);
        addClass(btnTb, 'focus');
        addClass(btnGo,'btnfocus');
//        btnGo.style.cssText = "background-color:#31ACE2;color:#FFF;";
    },
    //跳转框失去输入焦点时
    blurGopage: function () {
        var _this = this;
        var btnGo = document.getElementById(this.gopageButtonId);
        var btnTb = document.getElementById(this.gopageTextboxId);
        removeClass(btnTb, 'focus');
        removeClass(btnGo, 'btnfocus');
        
    },
    //跳转输入框按键操作
    keypressGopage: function () {
        var event = arguments[0] || window.event;
        var code = event.keyCode || event.charCode;
        //delete key
        if (code == 8) return true;
        //enter key
        if (code == 13) {
            pagination.gopage();
            return false;
        }
        //copy and paste
        if (event.ctrlKey && (code == 99 || code == 118)) return true;
        //only number key
        if (code < 48 || code > 57) return false;
        return true;
    },
    //跳转框页面跳转
    gopage: function () {
        var btnTb = document.getElementById(this.gopageTextboxId);
        var str_page = btnTb.value;
        if (isNaN(str_page)) {
            str_page = this.next;
            return;
        }
        var n = parseInt(str_page);
        if (n < 1) n = 1;
        if (n > this.total) n = this.total;
        window.location = this.getLink(n);
    },
    //生成控件代码
    generPageHtml: function (config, enforceInit) {
        if (enforceInit || !this.inited) {
            this.init(config);
        }
        var strPrv = '',
            strNext = '';
        if (this.hasPrv) {
            strPrv = '<a ' + this.getHandlerStr(this.prv) + ' title="上一页" class="strPrv">' + '<' + '</a>';
        } else {
            strPrv = '<span class="disabled">' + '<' + '</span>';
        }
        if (this.hasNext) {
            strNext = '<a ' + this.getHandlerStr(this.next) + ' title="下一页" class="strNext">' + '>' + '</a>';
        } else {
            strNext = '<span class="disabled">' + '>' + '</span>';
        }
        var str = '';
        var dot = '<span class="spanDot">...</span>';
        var gopageInfo = '';
        gopageInfo = '<span class="goPageBox"><span id="' + this.gopageWrapId + '">' +
            '<input type="button" id="' + this.gopageButtonId + '" onclick="pagination.gopage()" value="跳页" />' +
            '<input type="text" id="' + this.gopageTextboxId + '" onfocus="pagination.focusGopage()"  onkeypress="return pagination.keypressGopage(event);"   onblur="pagination.blurGopage()" value="' + this.next + '" /></span></span>';

        //分页处理
        if (this.total <= 8) {
            for (var i = 1; i <= this.total; i++) {
                if (this.pno == i) {
                    str += '<span class="curr">' + i + '</span>';
                } else {
                    str += '<a ' + this.getHandlerStr(i) + ' title="第' + i + '页">' + i + '</a>';
                }
            }
        } else {
            if (this.pno <= 5) {
                for (var i = 1; i <= 7; i++) {
                    if (this.pno == i) {
                        str += '<span class="curr">' + i + '</span>';
                    } else {
                        str += '<a ' + this.getHandlerStr(i) + ' title="第' + i + '页">' + i + '</a>';
                    }
                }
                str += dot + '<a ' + this.getHandlerStr(this.total) + ' title="第' + this.total + '页">' + this.total + '</a>';
            } else {
                str += '<a ' + this.getHandlerStr(1) + ' title="第' + 1 + '页">1</a>';
                str += '<a ' + this.getHandlerStr(2) + ' title="第' + 2 + '页">2</a>';
                str += dot;

                var begin = this.pno - 2;
                var end = this.pno + 2;
                if (end > this.total - 2) {
                    end = this.total - 2;
                    begin = end - 4;
                    if (this.pno - begin < 2) {
                        begin = begin - 1;
                    }
                } else if (end + 1 == this.total - 2) {
                    end = this.total - 2;
                }
                for (var i = begin; i <= end; i++) {
                    if (this.pno == i) {
                        str += '<span class="curr">' + i + '</span>';
                    } else {
                        str += '<a ' + this.getHandlerStr(i) + ' title="第' + i + '页">' + i + '</a>';
                    }
                }
                if (end != this.total - 2) {
                    str += dot;
                }
                for (var i = this.total - 1; i < this.total + 1; i++) {
                    if (this.pno == i) {
                        str += '<span class="curr">' + i + '</span>';
                    } else {
                        str += '<a ' + this.getHandlerStr(i) + ' title="第' + i + '页">' + i + '</a>';
                    }
                }
            }
        }
        var paginationHtml = '<div>';
        paginationHtml += '<span class="infoTextAndGoPageBtnWrap">'  + gopageInfo + '</span>';
        paginationHtml += '<span class="pageBtnWrap">'+ strPrv + str + strNext + '</span>'
        paginationHtml += '</div><div style="clear:both;"></div>';
        document.getElementById(this.paginationid).innerHTML = paginationHtml;
    },
    //分页按钮控件初始化
    init: function (config) {
        this.pno = isNaN(config.pno) ? 1 : parseInt(config.pno);
        this.total = isNaN(config.total) ? 1 : parseInt(config.total);
        this.totalRecords = isNaN(config.totalRecords) ? 0 : parseInt(config.totalRecords);
        if (config.paginationid) {
            this.paginationid = config.paginationid;
        }
        if (config.gopageWrapId) {
            this.gopageWrapId = config.gopageWrapId;
        }
        if (config.gopageButtonId) {
            this.gopageButtonId = config.gopageButtonId;
        }
        if (config.gopageTextboxId) {
            this.gopageTextboxId = config.gopageTextboxId;
        }
        if (config.getLink && typeof (config.getLink) == 'function') {
            this.getLink = config.getLink;
        }
        if (config.click && typeof (config.click) == 'function') {
            this.click = config.click;
        }
        if (!this._config) {
            this._config = config;
        }

        //validate
        if (this.pno < 1) this.pno = 1;
        this.total = (this.total <= 1) ? 1 : this.total;
        if (this.pno > this.total) this.pno = this.total;
        this.prv = (this.pno <= 2) ? 1 : (this.pno - 1);
        this.next = (this.pno >= this.total - 1) ? this.total : (this.pno + 1);
        this.hasPrv = (this.pno > 1);
        this.hasNext = (this.pno < this.total);

        this.inited = true;
    },
    getHandlerStr: function (n) {
        return 'href="' + this.getLink(n) + '"';
    }
};