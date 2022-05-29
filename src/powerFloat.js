var $powerFloat = function(t, n) {
		$isEle(t) && (t = [t]);
		if (!$isArr(t)) return !1;
		var r = {
			width: "auto",
			offsets: {
				x: 0,
				y: 0
			},
			zIndex: 19,
			eventType: "hover",
			showDelay: 0,
			hideDelay: 0,
			hoverHold: !0,
			targetMode: "common",
			target: null,
			targetAttr: "rel",
			container: null,
			reverseSharp: !1,
			position: "4-1",
			edgeAdjust: !1,
			showCall: $empty,
			hideCall: $empty
		},
			i = {
				targetGet: function() {
					if (!this.trigger) return this;
					var e = this.trigger.attr(this.s.targetAttr),
						t = this.s.target;
					
					switch (this.s.targetMode) {
					case "common":
						return t ? $isEle(t) ? i.target = t : $isArr(t) && $isEle(t[0]) ? i.target = t[0] : $isStr(t) && $(t) && (i.target = $(t)) : e && $(e) && (i.target = $(e)), i.target && i.targetShow(), this;
					case "ajax":
						var n = t || e;
						this.targetProtect = !1;
						if (/(\.jpg|\.png|\.gif|\.bmp|\.jpeg)$/i.test(n)) if (i.cacheData[n]) i.target = i.cacheData[n], i.targetShow();
						else {
							var r = new Image;
							i.loading(), r.onload = function() {
								var e = r.width,
									t = r.height,
									s = $(window).getWidth(),
									u = $(window).getHeight(),
									a = e / t,
									f = s / u;
								a > f ? e > s / 2 && (e = s / 2, t = e / a) : t > u / 2 && (t = u / 2, e = t * a);
								var l = (new Element("img")).attr({
									width: e,
									height: t,
									src: n,
									"class": "float_ajax_image"
								});
								i.target = l, i.cacheData[n] = l, i.targetShow()
							}, r.onerror = function() {
								i.target = (new Element("div")).addClass("float_ajax_error").set("text", "图片加载失败！"), i.targetShow()
							}, r.src = n
						} else n && (i.cacheData[n] ? (i.target = (new Element("div")).addClass("float_ajax_data").html(i.cacheData[n]), i.targetShow()) : (i.loading(), (new Request.HTML({
							method: "get",
							url: n,
							onComplete: function(e, t, r, s) {
								i.target = (new Element("div")).addClass("float_ajax_data").html(r), i.targetShow(), i.cacheData[n] = r
							},
							onError: function() {
								i.target = (new Element("div")).addClass("float_ajax_error").set("text", "数据没有加载成功。"), i.targetShow()
							}
						})).send()));
						break;
					case "list":
						var s = (new Element("ul")).addClass("float_list_ul"),
							u = "",
							a;
						$isArr(t) && (a = t.length) ? t.each(function(e, t) {
							var n = "",
								r = "",
								i, s;
							t === 0 && (r = ' class="float_list_li_first"'), t === a - 1 && (r = ' class="float_list_li_last"'), $isObj(e) && (i = e.text.toString()) ? (s = e.href || "javascript:") ? n = '<a href="' + s + '" class="float_list_a">' + i + "</a>" : n = i : e && $isStr(e) && (n = e), n && (u += "<li" + r + ">" + n + "</li>")
						}) : u += '<li class="float_list_null">列表无数据。</li>', i.target = s.html(u), this.targetProtect = !1, i.targetShow();
						break;
					case "remind":
						var f = t || e;
						this.targetProtect = !1, $isStr(f) && (i.target = (new Element("span")).html(f), i.targetShow());
						break;
					default:
						var l = t || e;
						l && ($isStr(l) ? $$(l).length ? (i.target = $$(l)[0], this.targetProtect = !0) : i.target = (new Element("div")).html(l) : $isEle(l) ? i.target = l : $isArr(l) && $isEle(l[0]) && (i.target = l[0]), i.targetShow())
					}
					return this
				},
				container: function() {
					var e = this.s.container,
						t = this.s.targetMode || "mode";
					return t === "ajax" || t === "remind" ? this.s.sharpAngle = !0 : this.s.sharpAngle = !1, this.s.reverseSharp && (this.s.sharpAngle = !this.s.sharpAngle), t !== "common" && (e === null && (e = "plugin"), e === "plugin" && ($("floatBox_" + t) || (new Element("div")).attr("id", "floatBox_" + t).addClass("float_" + t + "_box").out().inject(document.body), e = $("floatBox_" + t)), e && !$isStr(e) && (this.targetProtect && i.target.show().into(), i.target = e.empty().adopt(i.target))), this
				},
				setWidth: function() {
					var e = this.s.width;
					return e === "auto" ? this.target.style.width && this.target.css("width", "auto") : e === "inherit" ? this.target.w(this.trigger.w()) : this.target.css("width", e), this
				},
				position: function() {
					var e = this.trigger.getPosition(),
						t = 0,
						n = 0,
						r = 0,
						s = 0,
						u, a, f, l, c, h, p = this.target.h(),
						d = this.target.w(),
						v = window.getScroll().y,
						m = this.s.offsets.x.toInt() || 0,
						g = this.s.offsets.y.toInt() || 0,
						t = this.trigger.h();
					n = this.trigger.w(), u = e.x, a = e.y;
					var y = ["4-1", "1-4", "5-7", "2-3", "2-1", "6-8", "3-4", "4-3", "8-6", "1-2", "7-5", "3-2"],
						b = this.s.position,
						w = !1,
						E;
					y.each(function(e) {
						if (e === b) {
							w = !0;
							return
						}
					}), w || (b = "4-1");
					var S = function(e) {
							var t = "bottom";
							switch (e) {
							case "1-4":
							case "5-7":
							case "2-3":
								t = "top";
								break;
							case "2-1":
							case "6-8":
							case "3-4":
								t = "right";
								break;
							case "1-2":
							case "8-6":
							case "4-3":
								t = "left";
								break;
							case "4-1":
							case "7-5":
							case "3-2":
								t = "bottom"
							}
							return t
						},
						x = function(e) {
							return e === "5-7" || e === "6-8" || e === "8-6" || e === "7-5" ? !0 : !1
						},
						T = function(e) {
							var r = 0,
								s = 0,
								f = i.s.sharpAngle && i.corner ? !0 : !1;
							if (e === "right") {
								s = u + n + d + m, f && (s += i.corner.w());
								if (s > $(window).getWidth()) return !1
							} else if (e === "bottom") {
								r = a + t + p + g, f && (r += i.corner.h());
								if (r > v + $(window).getHeight()) return !1
							} else if (e === "top") {
								r = p + g, f && (r += i.corner.h());
								if (r > a - v) return !1
							} else if (e === "left") {
								s = d + m, f && (s += i.corner.w());
								if (s > u) return !1
							}
							return !0
						};
					E = S(b), this.s.sharpAngle && this.createSharp(E), this.s.edgeAdjust && (T(E) ?
					function() {
						if (x(b)) return;
						var e = {
							top: {
								right: "2-3",
								left: "1-4"
							},
							right: {
								top: "2-1",
								bottom: "3-4"
							},
							bottom: {
								right: "3-2",
								left: "4-1"
							},
							left: {
								top: "1-2",
								bottom: "4-3"
							}
						},
							t = e[E],
							n;
						if (t) for (n in t) T(n) || (b = t[n])
					}() : function() {
						if (x(b)) {
							var e = {
								"5-7": "7-5",
								"7-5": "5-7",
								"6-8": "8-6",
								"8-6": "6-8"
							};
							b = e[b]
						} else {
							var t = {
								top: {
									left: "3-2",
									right: "4-1"
								},
								right: {
									bottom: "1-2",
									top: "4-3"
								},
								bottom: {
									left: "2-3",
									right: "1-4"
								},
								left: {
									bottom: "2-1",
									top: "3-4"
								}
							},
								n = t[E],
								r = [];
							for (name in n) r.push(name);
							T(r[0]) || !T(r[1]) ? b = n[r[0]] : b = n[r[1]]
						}
					}());
					var N = S(b),
						C = b.split("-")[0];
					this.s.sharpAngle && (this.createSharp(N), r = this.corner.w(), s = this.corner.h());
					switch (N) {
					case "top":
						l = a - g - p - s, C == "1" ? f = u - m : C === "5" ? f = u - (d - n) / 2 - m : f = u - (d - n) - m, h = a - s - g - 1, c = u - (r - n) / 2;
						break;
					case "right":
						f = u + n + m + r, C == "2" ? l = a + g : C === "6" ? l = a - (p - t) / 2 + g : l = a - (p - t) + g, c = u + n + m + 1, h = a - (s - t) / 2;
						break;
					case "bottom":
						l = a + t + g + s, C == "4" ? f = u + m : C === "7" ? f = u - (d - n) / 2 + m : f = u - (d - n) + m, h = a + t + g + 1, c = u - (r - n) / 2;
						break;
					case "left":
						f = u - d - m - r, C == "2" ? l = a - g : C === "6" ? l = a - (d - n) / 2 - g : l = a - (p - t) - g, c = f + r, h = a - (d - r) / 2
					}
					return s && r && this.corner && this.corner.css({
						left: c,
						top: h,
						zIndex: this.s.zIndex + 1
					}), this.target.css({
						position: "absolute",
						left: f,
						top: l,
						zIndex: this.s.zIndex
					}), this
				},
				createSharp: function(e) {
					var t, n, r = "",
						i = "",
						s = {
							left: "right",
							right: "left",
							bottom: "top",
							top: "bottom"
						},
						o = s[e] || "top";
					this.target && (t = this.target.css("background-color"), this.target.css("border-" + o + "-width").toInt() > 0 && (n = this.target.css("border-" + o + "-color")), n && n !== "transparent" ? r = 'style="color:' + n + ';"' : r = 'style="display:none;"', t && t !== "transparent" ? i = 'style="color:' + t + ';"' : i = 'style="display:none;"');
					var u = '<span class="corner corner_1" ' + r + '>◆</span><span class="corner corner_2" ' + i + ">◆</span>",
						a = (new Element("div")).attr("id", "floatCorner_" + e).addClass("float_corner float_corner_" + e).html(u);
					return $("floatCorner_" + e) || a.inject(document.body), this.corner = $("floatCorner_" + e), this
				},
				targetHold: function() {
					if (this.s.hoverHold) {
						var e = this.s.hideDelay.toInt() || 200;
						this.target.addEvents({
							mouseenter: function() {
								i.flagDisplay = !0
							},
							mouseleave: function() {
								i.flagDisplay = !1, setTimeout(function() {
									i.displayDetect()
								}, e)
							}
						})
					}
					return this
				},
				loading: function() {
					return this.target = (new Element("div")).addClass("float_loading"), this.targetShow(), this
				},
				displayDetect: function() {
					return this.flagDisplay || this.targetHide(), this
				},
				targetShow: function() {
					return i.cornerClear(), this.flagDisplay = !0, this.container().setWidth().position(), this.target.show(), $isFun(this.s.showCall) && this.s.showCall.call(this.trigger, this.target), window.powerFloatHide = function() {
						i.targetHide()
					}, this
				},
				targetHide: function() {
					return this.flagDisplay = !1, this.targetClear(), this.cornerClear(), $isFun(this.s.hideCall) && this.s.hideCall.call(this.trigger), this.target = null, this.trigger = null, this.s = {}, this.targetProtect = !1, this
				},
				targetClear: function() {
					this.target && (this.targetProtect && this.target.getFirst().out().inject(document.body), this.target.out())
				},
				cornerClear: function() {
					this.corner && this.corner.dispose()
				},
				target: null,
				trigger: null,
				s: {},
				cacheData: {},
				targetProtect: !1
			},
			s = function(e) {
				if (!i.flagDisplay) return !1;
				var t = e.page.x,
					n = e.page.y,
					r = i.target.getPosition(),
					u = i.target.w(),
					a = i.target.h();
				if (i.s.eventType === "click" && e.target != i.trigger || i.s.eventType == "contextmenu") t > r.x && t < r.x + u && n > r.y && n < r.y + a || (i.flagDisplay = !1, i.displayDetect(), document.removeEvent("mouseup", s));
				return !1
			};
		return t.each(function(t) {
			var u = $extend(r, n || {}),
				a = function(e, t) {
					i.target && i.target.isDisplayed() && i.targetHide(), i.s = e, i.trigger = t
				},
				f = function(t) {
					
					return i.flagDisplay && e.target === i.trigger ? (i.flagDisplay = !1, i.displayDetect()) : (a(u, t), i.targetGet()), document[i.flagDisplay ? "addEvent" : "removeEvent"]("mouseup", s), !1
				};
			switch (u.eventType) {
			case "hover":
				t.addEvents({
					mouseenter: function() {
						var e = u.showDelay.toInt(),
							t;
						a(u, this), e ? (t && $clear(t), t = i.targetGet.bind(i).delay(e)) : i.targetGet()
					},
					mouseleave: function() {
						i.flagDisplay = !1, i.targetHold(), u.hoverHold ? setTimeout(function() {
							i.displayDetect()
						}, 200) : i.displayDetect()
					}
				}), u.hoverFollow && $(this).mousemove(function(e) {
					return i.cacheData.left = e.page.x, i.cacheData.top = e.page.y, i.targetGet(), !1
				});
				break;
			case "click":
				t.addEvent("click", function(e) {
					f(this)
				});
				break;
			case "contextmenu":
				t.addEvent("contextmenu", function(e) {
					e.preventDefault(), f(this)
				});
				break;
			case "focus":
				t.addEvents({
					focus: function() {
						setTimeout(function() {
							a(u, this), i.targetGet()
						}.bind(this), 200)
					},
					blur: function() {
						i.flagDisplay = !1, setTimeout(function() {
							i.displayDetect()
						}, 190)
					}
				});
				break;
			default:
				a(u, t), i.targetGet()
			}
		})
	};
$powerFloat.extend({
	hide: function() {
		window.powerFloatHide && powerFloatHide()
	}
})