// DEPENDENCIES:
// -- JQuery
// -- window.microstrategy
// -- window.mstrConfig
// -- window.mstrmojo

mstrmojo.requiresDescs('16224'); // Login with Badge
mstrmojo.requiresDescs('16388'); // Contacting Identity Server...
mstrmojo.requiresDescs('16389'); // Failed to contact Identity Server

(function () {

    var USHER_AUTHMODE = 256;

    function usherPollForQRScan(buttonText) {
        var params = {
                taskId: "usherLoginWeb",
                pollOnly: "true",
                server: mstrConfig.serverName,
                port: mstrConfig.serverPort,
                project: mstrConfig.projectName
            },
            callbacks = {
                success: function (res) {
                    // just because it came back from the task successfully doesn't mean
                    // that the task call to usher actually succeeded
                    // got to inspect the response...
                    try {
                        if (res.status == "success") {
                            var usherLoginForm = document.getElementById("usherLoginForm");
                            if (usherLoginForm) {
                                microstrategy.showWait();
                                usherLoginForm.ConnMode.value = USHER_AUTHMODE;
                                usherLoginForm.submit();
                            }
                        }
                    } catch (e) {
                        alert("usherPollForQRScan exception:\n " + e.messsage);
                    }
                },
                failure: function (res) {
                    alert(mstrmojo.desc(16389, "Failed to contact Identity Server"));
                    console.log(res);
                    buttonText.nodeValue = mstrmojo.desc(16389, "Failed to contact Identity Server");
                }
            };

        mstrmojo.xhr.request("POST", mstrConfig.taskURL, callbacks, params);
    }


    function getQRCode(anchor, buttonText) {

        var callbacks = {
                success: function (res) {
                    // just because it came back from the task successfully doesn"t mean
                    // that the task call to usher actually
                    // succeeded
                    // got to inspect the response...
                    try {
                        var code = res.code;
                        var url = window.location.href;
                        // iOS Safari browser does not honor setInterval polling once
                        // the user leaves the page to enter Usher 
                        if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
                            // This causes a new window to be opened
                            // openedByUsher Dummy param let landingPage know usherQR has
                            // been called and therefore call usherLoginWeb onload
                            if (url.indexOf('?') !== -1) {
                                url = url.replace("?","?openedByUsher=1&");
                            }
                            else {
                                url = url + '?openedByUsher=1';
                            }
                        } else {
                            // Android Chrome browser honors setInterval
                            // polling, but Android Usher does not honor
                            // redirect URL
                            setInterval(function(){ usherPollForQRScan(buttonText);}, 500); 
                        }
                        anchor.href = "uniusher://authorize?qr=" + code + "&client_id=" + res.clientID + "&redirect=true&redirect_uri=" + encodeURIComponent(url);
                        buttonText.nodeValue = mstrmojo.desc(16224, "Use Badge to login");
                    } catch (e) {
                        alert("getQRCode:\n " + e.message);
                    }
                },
                failure: function (res) {
                    alert(mstrmojo.desc(16389, "Failed to contact Identity Server"));
                    console.log(res);
                    buttonText.nodeValue = mstrmojo.desc(16389, "Failed to contact Identity Server");
                }
            },
            params = {
                taskID: "usherQR"
            };

        mstrmojo.xhr.request("POST", mstrConfig.taskURL, callbacks, addExtraParams.call(this, params));
    }

    function addExtraParams(params) {
        params.sn = this.serverName || mstrConfig.serverName;
        params.sp = this.serverPort || mstrConfig.serverPort;
        params.connectionId = this.connectionId || '';

        return params;
    }

    function showAjaxError(res) {
        function showError(errMsg) {
            var errNode = document.getElementById("mstrWeb_error");
            if (errNode) {
                var usherErrNode = document.getElementById("usherError");
                if (usherErrNode) {
                    usherErrNode.innerHTML = errMsg;
                } else {
                    usherErrNode = document.createElement("div");
                    usherErrNode.id = "usherError";
                    usherErrNode.className = "mstrAlert";
                    usherErrNode.innerHTML = errMsg;
                    errNode.appendChild(usherErrNode);
                }
            }
        }
        if (res.getResponseHeader) {
            var errMsg = res.getResponseHeader("X-MSTR-TaskFailureMsg");
            showError(errMsg);
        } else {
            if (res.message) {
                showError(res.message);
            } else {}
        }
    }

    function handlePlaceholder() {
        if (!("placeholder" in document.createElement("input"))) {
            var inputs = [document.getElementById("Uid"), document.getElementById("Pwd"), document.getElementById("tsvc")],
                fnPlaceholder = function (input) {
                    mstrmojo.css.toggleClass(input.parentNode, "placeholder", mstrmojo.string.trim(input.value).length == 0);
                };
            for (var i in inputs) {
                var input = inputs[i];
                if (input) {
                    fnPlaceholder(input);
                    input.attachEvent("onpropertychange", function (evt) {
                        fnPlaceholder(mstrmojo.dom.eventTarget(window, evt));
                    });
                }
            }
        }
    }
    window.mstrLoginUtils = {
        setStandardModeVisible: function (v) {
            var divLogin = document.getElementById("divLogin");
            divLogin.style.visibility = v ? "visible" : "hidden";
            divLogin.style.opacity = v ? 1 : 0;
            if (!/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                if (!v) {
                    mstrmojo.all.mstrUsherLogin.set("visible", !v);
                }
                window.setTimeout(function () {
                    mstrmojo.all.mstrUsherLogin.toggleRegister(false);
                    mstrmojo.all.mstrUsherLogin.set("visible", !v);
                }, 550);
            }
        },
        toggleLoginMode: function (elToggleAnchor) {
            var elToggle = elToggleAnchor.parentNode,
                wasUsher = elToggle.getAttribute("usher") === "1",
                elLoginContainer = elToggle.previousSibling;
            mstrLoginUtils.setStandardModeVisible(wasUsher);
            elLoginContainer.className = elLoginContainer.className.replace(/ std/g, "") + (wasUsher ? " std" : "");
            elToggle.setAttribute("usher", wasUsher ? "0" : "1");
            elToggle.innerHTML = microstrategy.descriptors.getDescriptor(wasUsher ? 14140 : 14138).replace("###", '<a href="#" onclick="mstrLoginUtils.toggleLoginMode(this); return false;">').replace("##", "</a>");
        },
        startUsher: function () {
            var usherLoginVisible = parseInt(mstrConfig.defaultLoginMode, 10) === USHER_AUTHMODE;
            (new mstrmojo.UsherLogin({
                placeholder: "usher-placeholder",
                id: "mstrUsherLogin",
                visible: usherLoginVisible,
                loadQR: true,
                onUsherLogin: function () {
                    var usherLoginForm = document.getElementById("usherLoginForm");
                    if (usherLoginForm) {
                        microstrategy.showWait();
                        usherLoginForm.ConnMode.value = USHER_AUTHMODE;
                        usherLoginForm.submit();
                    }
                },
                usherRegistrationOption: mstrConfig.usherRegistrationOption,
                usherRegistrationDomain: mstrConfig.usherRegistrationDomain,
                onUsherError: showAjaxError
            })).render();
            var divLogin = document.getElementById("divLogin");
            if (divLogin && divLogin.parentNode) {
                mstrmojo.css.addClass(divLogin.parentNode, "usherLogin");
            }
            var elToggle = document.getElementById("toggleLoginMode");
            if (parseInt(mstrConfig.enabledAuthMode, 10) === USHER_AUTHMODE) {
                elToggle.style.display = "none";
                mstrLoginUtils.setStandardModeVisible(false);
            } else {
                if (!usherLoginVisible) {
                    mstrLoginUtils.setStandardModeVisible(true);
                    elToggle.setAttribute("usher", "0");
                    mstrmojo.css.addClass(divLogin.parentNode, "std");
                    elToggle.innerHTML = microstrategy.descriptors.getDescriptor(14140).replace("###", '<a href="#" onclick="mstrLoginUtils.toggleLoginMode(this); return false;">').replace("##", "</a>");
                } else {
                    mstrLoginUtils.setStandardModeVisible(false);
                }
            }
        },
        showUsher: function () {
            if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
                var usherLogin = document.getElementsByClassName('mstrLoginContainer')[0];
                if (usherLogin) {

                    mstrmojo.css.addClass(usherLogin, "usherMobileLogin");

                    var btn = document.createElement("button");
                    var t = document.createTextNode(mstrmojo.desc(16388, "Contacting Identity Server..."));
                    btn.appendChild(t);

                    mstrmojo.css.addClass(btn, "mstrButton mobile");

                    var a = document.createElement("a");
                    a.appendChild(btn);

                    var div = document.createElement("div");
                    mstrmojo.css.addClass(div, "mstrLoginButtonBarLeft mobile");
                    div.appendChild(a);
                    usherLogin.appendChild(div);

                    if(!window.location.href.includes("openedByUsher=1")){
                        getQRCode(a,t);
                    } else {
                        usherPollForQRScan(t);
                    }
                }
                mstrLoginUtils.setStandardModeVisible(false);
            } else {
                mstrLoginUtils.startUsher();
            }
        },
        changeAuthMode: function changeAuthMode(btn) {
            var stdLogin = document.getElementById("fieldDiv2fa");
            var authModeValue = parseInt(btn.value, 10);
            if (stdLogin) {
                stdLogin.style.visibility = (authModeValue !== 1 && authModeValue !== 16) ? "hidden" : "visible";
            }
        }
    };
}
());
