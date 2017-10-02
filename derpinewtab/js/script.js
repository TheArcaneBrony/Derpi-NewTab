"use strict";
$(function() {
    function e(e) {
        if ("string" == typeof e) k = e;
        else if ("string" != typeof k) return;
        var t = k.replace(/"/g, "%22"),
            a = '#image{background-image:url("' + t + '");background-size:' + o.crop + "}";
        "contain" === o.crop && (u.css("opacity", ""), a += '#image-ghost{display:block;background-image:url("' + t + '")}'), m.html(a)
    }

    function t(a) {
        function l(t, a) {
            var n = t.tags.split(", "),
                o = [];
            $.each(n, function(e, t) {
                0 === t.indexOf("artist:") && o.push(t.substring(7))
            });
            var s = o.length ? "By " + i(o) : "Artist unknown";
            v.empty().append('<h1><a href="https://derpibooru.org/' + t.id + '">' + s + "</a></h1>"), v.children("h1").simplemarquee({
                speed: 25,
                cycles: 1 / 0,
                space: 25,
                handleHover: !1,
                delayBetweenCycles: 0
            });
            var r = "",
                l = t.comment_count;
            t.upvotes + t.downvotes === 0 ? r = "no votes" : t.upvotes > 0 ? (r += t.upvotes + " upvote", t.upvotes > 1 && (r += "s"), t.downvotes > 0 && (r += " and " + t.downvotes + " downvote", t.downvotes > 1 && (r += "s"))) : t.downvotes > 0 && (r += t.downvotes + " downvote" + (t.downvotes > 1 ? "s" : "")), v.append('<p>\n\t\t\t\t\t<span class="uploadtime visible">uploaded <time datetime="' + t.created_at + '"></time> by ' + t.uploader + '</span>\n\t\t\t\t\t<span class="votes">' + r + '</span>\n\t\t\t\t\t<span class="comments">' + (l > 0 ? l : "no") + " comment" + (1 !== l ? "s" : "") + "</span>\n\t\t\t\t</p>"), updateMetadataSettings(), window.updateTimesF(), e(a), g(), p()
        }

        function g() {
            h.css("opacity", 1), c.on("mousemove", $.throttle(100, function() {
                return !!document.getElementById("dialog") || (f.css("opacity", "1"), f.on("mouseenter", "> *", function() {
                    $(this).addClass("hover")
                }).on("mouseleave", "> *", function() {
                    $(this).removeClass("hover")
                }), void p())
            })), c.triggerHandler("mousemove"), S.attr("disabled", !1).on("click", function(e) {
                e.preventDefault(), r.toggleClass("open"), c.triggerHandler("mousemove")
            })
        }

        function p() {
            u !== !1 && (clearTimeout(u), u = !1), r.hasClass("open") || (u = setTimeout(m, 2e3))
        }
        c.removeClass("notloading"), d.find(".re-request:visible").slideUp(), $.ajax({
            url: "https://trixiebooru.org/search.json?filter_id=" + (o.filterID || s) + "&q=wallpaper+%26%26+(" + o.allowedTags.join("+%7C%7C+") + ")+%26%26+-equestria+girls" + ("number" == typeof a ? "&page=" + a : ""),
            success: function(e) {
                var i = void 0,
                    s = new Image,
                    r = -1;
                if (e = e.search, 0 === e.length) return g(), c.addClass("notloading"), void v.html("<h1>Search returned no results.</h1>" + (o.allowedTags.indexOf("safe") === -1 ? "<p>Try enabling the safe system tag.</p>" : ""));
                for (; ++r < e.length - 1;)
                    if (e[r].width >= 1280 && e[r].height >= 720 && e[r].width <= 4096 && e[r].height <= 4096) {
                        i = e[r];
                        break
                    }
                return c.addClass("notloading"), "undefined" == typeof i ? t("number" == typeof a ? a + 1 : 2) : void(LStorage.has("image_hash") && LStorage.get("image_hash") === i.sha512_hash ? l(i, n()) : ("undefined" == typeof a && v.html("<h1>Searching for new image...</h1>").css("opacity", "1"), s.src = "http://" + i.image, $(s).on("load", function() {
                    LStorage.set("image_data", s.src), LStorage.set("image_hash", i.sha512_hash), l(i, s.src)
                }).on("error", function() {
                    return v.html("<h1>Image has not been rendered yet</h1><p>Try reloading in a minute or so</p>"), g(), t("number" == typeof a ? a + 1 : 2)
                })))
            },
            error: function() {
                c.addClass("notloading"), v.html("<h1>There was an error while fetching the image data</h1><p>" + (navigator.onLine ? "Derpibooru may be down for maintenance, try again later." : "You are not conected to the Internet.") + "</p>")
            }
        });
        var u = !1,
            m = function y() {
                f.children(".hover").length ? u = setTimeout(y, 2e3) : f.css("opacity", 0)
            }
    }

    function a() {
        c.off("mousemove"), S.off("click").attr("disabled", !0), r.removeClass("open")
    }

    function n() {
        return LStorage.get("image_data")
    }

    function i(e, t, a) {
        "undefined" == typeof t && (t = "and"), "undefined" == typeof a && (a = ",");
        var n = void 0;
        if ("string" == typeof e && (e = e.split(a)), e.length > 1) {
            n = e;
            var i = n.length,
                o = i - 3,
                s = 0;
            for (n.splice(i - 1, 0, t); s <= o;) s !== i - 1 && (n[s] += ",", s++);
            n = n.join(" ")
        } else n = e[0];
        return n
    }
    $.getJSON("manifest.json", function(e) {
        e && $("#disp-version").text(" v" + e.version)
    });
    var o = {
            allowedTags: [],
            metadata: {},
            crop: void 0,
            filterID: void 0
        },
        s = 56027,
        r = $("#settingsWrap"),
        l = $("#settings"),
        d = $("#tag-settings"),
        c = $("body"),
        g = $("#metadata-settings"),
        p = $("#crop-settings"),
        h = $("#image"),
        u = $("#image-ghost"),
        f = $("#fade-layer"),
        v = $("#data"),
        m = $("#style"),
        y = $("#filter-id"),
        w = $("#filter-id-select"),
        b = $("#signin-filter"),
        _ = d.find(".usefilter input"),
        S = $("#show-settings-button"),
        k = void 0;
    $.get("https://derpibooru.org/filters", function(e) {
            var t = $(e.replace(/src="[^"]+?"/g, "")),
                a = {
                    your: $(document.createElement("optgroup")).attr("label", "My Filters"),
                    global: $(document.createElement("optgroup")).attr("label", "Global Filters")
                },
                n = t.find(".header__link.header__link-user").attr("href");
            n || b.addClass("nope").attr("title", "You must be signed in on Derpibooru.org to see your own filters."), t.find(".filter").each(function() {
                var e = $(this),
                    t = e.children("h3").text(),
                    i = parseInt(e.children(".filter-options").find('a[href^="/filters/"]').attr("href").replace(/\D/g, ""), 10);
                i !== s && a[e.find('a[href="' + n + '"]').length ? "your" : "global"].append($(document.createElement("option")).attr("value", i).text(t))
            }), a.your.children().length && w.append(a.your), w.append(a.global), o.filterID ? w.find('option[value="' + o.filterID + '"]').length ? w.val(o.filterID) : w.val("???") : w.val("")
        }),
        function() {
            function e() {
                "number" == typeof i && (clearInterval(i), i = void 0), "number" == typeof s && (clearInterval(s), s = void 0);
                var e = 6,
                    n = function() {
                        if (0 === --e) return clearInterval(s);
                        var t = d.find(".re-request span").text(e + " second" + (1 !== e ? "s" : "")).parent();
                        t.is(":visible") || t.stop().hide().slideDown()
                    },
                    r = [];
                s = setInterval(n, 1e3), n(), i = setTimeout(function() {
                    c.children().each(function(e, t) {
                        var a = $(t).find("input"),
                            n = a.attr("name");
                        a.prop("checked") && r.push(n)
                    });
                    var e = r.length > 0,
                        n = parseInt(y.val(), 10),
                        i = !isNaN(n);
                    e && (o.allowedTags = r, LStorage.set("setting_allowed_tags", r.join(","))), i ? (o.filterID = n, LStorage.set("setting_filterid", o.filterID)) : (_.prop("checked", !1), o.filterID = void 0, LStorage.del("setting_filterid")), (e || i) && (h.css("opacity", "0"), u.css("opacity", "0"), a(), setTimeout(t, 300))
                }, 5e3)
            }
            var n = ["safe", "suggestive", "questionable", "explicit", "grimdark", "grotesque", "foalcon","","","animated", "*"],
                i = void 0,
                s = void 0;
            if (LStorage.has("setting_allowed_tags")) {
                var r = LStorage.get("setting_allowed_tags").split(",");
                $.each(r, function(e, t) {
                    n.indexOf(t) > -1 && o.allowedTags.push(t)
                }), o.allowedTags.length > 0 && LStorage.set("setting_allowed_tags", o.allowedTags.join(","))
            }
            0 === o.allowedTags.length && (LStorage.set("setting_allowed_tags", "safe"), o.allowedTags = ["safe"]);
            var c = l.find(".systags");
            if ($.each(n, function(e, t) {
                    c.append($(document.createElement("label")).append($(document.createElement("input")).attr({
                        type: "checkbox",
                        name: t,
                        checked: o.allowedTags.indexOf(t) > -1
                    }), "<span>" + t + "</span>"))
                }), l.find(".systags label span").on("click", function(t) {
                    t.preventDefault();
                    var a = $(this).prev();
                    a.prop("checked", !a.prop("checked")), e()
                }), LStorage.has("setting_filterid")) {
                var g = parseInt(LStorage.get("setting_filterid"), 10);
                isNaN(g) ? LStorage.del("setting_filterid") : (o.filterID = g, _.prop("checked", !0), y.val(o.filterID).trigger("change"))
            }
            0 === o.allowedTags.length && (LStorage.set("setting_allowed_tags", "safe"), o.allowedTags = ["safe"]), _.on("click", function() {
                var e = $(this),
                    t = e.prop("checked");
                t || y.val("").trigger("change")
            }), w.on("change keyup", function() {
                var e = w.val();
                e && /^\d+$/.test(e) && (_.prop("checked") !== !0 && _.prop("checked", !0), y.val(e).trigger("change"))
            }), y.on("change keyup", function() {
                if (w.find('option[value="' + y.val() + '"]').length ? w.val(y.val()) : w.val("???"), y.is(":valid")) {
                    var t = o.filterID ? o.filterID : "";
                    y.val() !== t && e()
                }
            })
        }(),
        function() {
            function e(e) {
                e !== !0 && LStorage.set("setting_metadata", a.join(",")), t.each(function() {
                    $("#data ." + this.name.substring(4))[a.indexOf(this.name) > -1 ? "show" : "hide"]()
                }), v.find("p span").filter(":visible").addClass("visible").last().removeClass("visible")
            }
            var t = g.find(".switch input"),
                a = void 0;
            t.each(function() {
                o.metadata[this.name] = !1
            }), LStorage.has("setting_metadata") ? (a = LStorage.get("setting_metadata"), a = 0 === a.length ? [] : a.split(",")) : (a = Object.keys(o.metadata), LStorage.set("setting_metadata", a.join(","))), $.each(a, function(e, t) {
                "undefined" != typeof o.metadata[t] ? o.metadata[t] = !0 : delete a[e]
            }), window.updateMetadataSettings = function() {
                e()
            }, e(), t.each(function() {
                this.checked = !!o.metadata[this.name], $(this).prop("checked", this.checked)
            }), g.find(".switch input").on("click", function(t) {
                t.stopPropagation();
                var n = this.name,
                    i = a.indexOf(n);
                i === -1 ? a.push(n) : a.splice(i, 1), e()
            })
        }(),
        function() {
            function t() {
                var t = o.crop;
                ["contain", "cover", "100% 100%"].indexOf(t) === -1 && (t = "cover"), LStorage.set("setting_crop", t), o.crop = t, a.val(t), e()
            }
            var a = p.find(".input-field select");
            LStorage.has("setting_crop") ? o.crop = LStorage.get("setting_crop") : (o.crop = "contain", LStorage.set("setting_crop", o.crop)), window.updateCroppingSettings = function() {
                t()
            }, t(), a.on("change", function() {
                o.crop = a.val(), t()
            })
        }(), LStorage.has("image_data") && LStorage.has("image_hash") && (e(LStorage.get("image_data")), h.css("opacity", "1").attr("data-hash", LStorage.get("image_hash"))), t(), v.html("<h1>Requesting metadata...</h1>").css("opacity", 1), LStorage.has("firstrun") || $(document.createElement("div")).attr("id", "dialog").html('<div id="dialog-inner"><h1>Welcome to Derpi-New Tab</h1><p>To access the settings click the <i class="material-icons">menu</i> icon in the bottom left of the browser window.<br><span style="color:rgba(255,255,255,.5)">(this message is only displayed once)</span></p></div>').children().append($(document.createElement("button")).text("Got it").on("click", function(e) {
            e.preventDefault(), LStorage.set("firstrun", 1);
            var t = $("#dialog").addClass("gtfo");
            setTimeout(function() {
                t.remove()
            }, 550)
        })).end().prependTo(c), p.find("select").material_select()
});
//# sourceMappingURL=script.js.map