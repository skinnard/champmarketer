var Popup = function (e) {
    (this.animation_length = 200),
      this.showing_popup,
      (this.popups = []),
      this.onexit,
      (this._hideLegacyPopups = function () {
        $(".popup").hide(), $("body").removeClass("noscroll");
      }),
      (this._findPopupById = function (e) {
        for (var t = 0; t < this.popups.length; t++)
          if (this.popups[t].id == e) return this.popups[t];
        return !1;
      }),
      (this._registerOnexit = function (e) {
        this.onexit = e;
      }),
      (this._unregisterOnexit = function () {
        this.onexit = void 0;
      }),
      (this._hidePopup = function (e, t) {
        this.showing_popup &&
          (e && this.onexit && this.onexit(),
          this.showing_popup.el.removeClass("visible"),
          setTimeout(
            function (e) {
              e.el.hide(), $("body").removeClass("noscroll");
            }.bind(this, this.showing_popup),
            this.animation_length
          ),
          (this.showing_popup = void 0),
          this._unregisterOnexit());
      }),
      (this._showPopup = function (e) {
        $("body").addClass("noscroll"),
          e.el.show(),
          e.el.addClass("visible"),
          (this.showing_popup = e);
      }),
      (this.closePopup = function (e) {
        this._hidePopup(e);
      }),
      (this.displayPopup = function (e, t) {
        var i = this._findPopupById(e);
        return (
          !!i &&
          (this.showing_popup
            ? (this._hidePopup(!1, !0), this._showPopup(i))
            : (this._hideLegacyPopups(), this._showPopup(i)),
          this._registerOnexit(t),
          !0)
        );
      }),
      (this._initListeners = function () {
        $(".popup-v2 .close").on("click", this._hidePopup.bind(this, !0)),
          $(".popup-v2").on(
            "click",
            function (e) {
              $(e.target).hasClass("popup-v2") && this._hidePopup(!0);
            }.bind(this)
          );
      }),
      (this._initPopups = function () {
        var e = $(".popup-v2");
        if (e.length > 0) {
          for (var t = 0; t < e.length; t++) {
            var i = { id: $(e[t]).attr("id"), el: $(e[t]) };
            this.popups.push(i);
          }
          return !0;
        }
        return !1;
      }),
      (this.init = function () {
        return (
          this._initPopups()
            ? this._initListeners()
            : console.log("No popups to init."),
          this
        );
      });
  },
  Checkbox = function (e, t) {
    return (
      (this.wrapper = $(e)),
      this.checkbox,
      this.checkmark,
      this.label,
      this.input,
      this.onChange,
      (this.isChecked = function () {
        return this.input.prop("checked");
      }),
      (this.forceChange = function (e, t) {
        (e = 1 == e),
          this.changeInputState(e),
          this.displayState(),
          t && this.onChange(this.isChecked());
      }),
      (this.registerListeners = function (e) {
        e.onChange && (this.onChange = e.onChange);
      }),
      (this.displayState = function () {
        this.isChecked()
          ? this.wrapper.addClass("checked")
          : this.wrapper.removeClass("checked");
      }),
      (this.changeInputState = function (e) {
        e ? this.input.prop("checked", !0) : this.input.prop("checked", !1);
      }),
      (this.handleChange = function (e) {
        this.displayState(), this.onChange && this.onChange(this.isChecked());
      }),
      (this.makeChange = function (e) {
        this.changeInputState(!this.isChecked()),
          this.displayState(),
          this.onChange && this.onChange(this.isChecked());
      }),
      (this.initListeners = function () {
        this.input.on("change", this.handleChange.bind(this)),
          t
            ? this.checkbox.on("click", this.makeChange.bind(this))
            : (this.checkbox.on("click", this.makeChange.bind(this)),
              this.label.on("click", this.makeChange.bind(this)));
      }),
      (this.init = function () {
        if (
          ((this.checkbox = this.wrapper.find(".checkbox-element")),
          (this.checkmark = this.wrapper.find(".checkbox-element-checkmark")),
          (this.label = this.wrapper.find("label")),
          (this.input = this.wrapper.find("input")),
          0 == this.checkbox.length ||
            0 == this.checkmark.lengt ||
            0 == this.input.length ||
            0 == this.label.length)
        )
          throw new Error(
            "Checkbox object initialization failed due to erroneous HTML layout"
          );
        this.initListeners();
      }.call(this)),
      this
    );
  },
  Checkout = function (e, t, i, s) {
    function a(e) {
      for (var t = [], i = 0; i < e.length; i++) {
        var s = {
          code: e[i].node.shortcode,
          thumbnail: e[i].node.thumbnail_src,
          is_video: e[i].node.is_video,
          is_igtv: !1,
          uploaded_at: new Date(e[i].node.taken_at_timestamp).toLocaleString(),
        };
        t.push(s);
      }
      return t;
    }
    (this._upsale = t),
      (this._promotion = i),
      (this._payment = s),
      this.checkout_method,
      (this.failed_attempts = 0),
      this.packages,
      this.package,
      this.price,
      this.username,
      this.email,
      this.user_data,
      (this.selected_media = []),
      this.trial,
      this.selected_country,
      this.selected_gender,
      this.selected_delay,
      (this.package_select = $("#checkout-package-select")),
      (this.country_select = $("#dashboard-country-select")),
      (this.gender_select = $("#dashboard-gender-select")),
      (this.delay_select = $("#dashboard-delay-select")),
      (this.delay_values = [
        { value: 0, text: e.delay_fastest() },
        { value: 30, text: e.delay_minutes_logic(30) },
        { value: 60, text: e.delay_hours_logic(1) },
        { value: 180, text: e.delay_hours_logic(3) },
        { value: 360, text: e.delay_hours_logic(6) },
        { value: 720, text: e.delay_hours_logic(12) },
        { value: 1440, text: e.delay_hours_logic(24) },
      ]),
      (this.targeting = {
        section: $("#checkout-single-targeting"),
        header: $(
          "#checkout-single-targeting #checkout-single-targeting-header"
        ),
        body: $("#checkout-single-targeting #checkout-single-targeting-body"),
      }),
      (this.summary = {
        selected: $("#summary-selected-media"),
        item_model: $("#models .selected-media-item"),
        country: $("#summary-targeting-country"),
        gender: $("#summary-targeting-gender"),
        delay: $("#summary-targeting-delay"),
      }),
      (this.summary_wrapper = $("#summary-wrapper")),
      (this.payment_wrapper = $("#payment")),
      (this.view = {
        wrapper: $("#checkout-box"),
        checkout_title: $("#checkout-box #checkout-box-title"),
        package: $("#checkout-package-wrapper"),
        email: $("#checkout-email-wrapper"),
        username: $("#checkout-username-wrapper"),
        step_one: $("#checkout-step-one"),
        step_one_descr: $("#checkout-box #checkout-box-description"),
        step_one_form: $("#checkout-step-one-form"),
        step_one_error: $("#checkout-step-one-error"),
        step_one_continue: $("#checkout-step-one-continue"),
        step_two: $("#checkout-step-two"),
        step_two_user: $("#checkout-step-two-user"),
        step_two_descr: $("#checkout-step-two .desc"),
        step_two_back: $("#checkout-step-two-back"),
        step_two_media: $("#checkout-step-two-media"),
        step_two_media_list: $("#checkout-step-two-media-list"),
        step_two_media_more: $("#checkout-step-two-media-load-more"),
        step_two_media_error: $("#checkout-step-two-error"),
        payment_trial_form: $("#payment-trial-form"),
        payment_trial_error: $("#payment-trial-form #payment-trial-form-error"),
        payment_trial_button: $("#payment-trial-form-button"),
        payment_reward: $("#reward-checkout"),
        payment_reward_error: $("#reward-checkout-error"),
        payment_reward_button: $("#reward-button"),
        payment_details: $("#payment #payment-details"),
        payment_description: $("#payment-description"),
        payment_price: $("#payment-price"),
        payment_notification: $("#payment-notification"),
        payment_processor: $("#payment-processor"),
      }),
      (this.payment_visible = !1),
      (this.isRewardApplicable = function () {
        return this.reward && this.reward.package == this.package.amount;
      }),
      (this.getSelectedMedia = function () {
        return this.selected_media;
      }),
      (this.getSelectedCodes = function () {
        for (var e = "", t = 0; t < this.selected_media.length; t++)
          e +=
            0 == t
              ? this.selected_media[t].code
              : "," + this.selected_media[t].code;
        return e;
      }),
      (this.getPackage = function (e) {
        try {
          for (var t = 0; t < this.packages.length; t++)
            if (this.packages[t].amount == e) return this.packages[t];
          return;
        } catch (e) {
          return;
        }
      }),
      (this.updatePrice = function () {
        if (this.trial) this.view.payment_price.text(e.price_free());
        else if (this.isRewardApplicable())
          this.view.payment_price.text(e.price_free());
        else if (t.isApplied()) {
          var i = t.getSelectedUpgrade(),
            s = this.package.price + i.price;
          "ru" == _lang
            ? (this.view.payment_price.text(e.price_single(s)),
              this._payment.updatePrice(s))
            : (this.view.payment_price.text(e.price_single(s.toFixed(2))),
              this._payment.updatePrice(s.toFixed(2))),
            this._payment.setPosts(this.getSelectedCodes());
        } else
          "ru" == _lang
            ? (this.view.payment_price.text(e.price_single(this.package.price)),
              this._payment.updatePrice(this.package.price))
            : (this.view.payment_price.text(
                e.price_single(this.package.price.toFixed(2))
              ),
              this._payment.updatePrice(this.package.price.toFixed(2))),
            this._payment.setPosts(this.getSelectedCodes());
      }),
      (this.submitTrial = function () {
        function t(t) {
          "ok" == t.status
            ? (window.location = t.redirect)
            : t.trial
            ? confirm(t.msg)
              ? (window.location = "/package/100")
              : this.hidePaymentTrialLoading()
            : t.msg
            ? (this.hidePaymentTrialLoading(), alert(t.msg))
            : (this.hidePaymentTrialLoading(), alert(e.error_unknown_string()));
        }
        function i(t) {
          this.hidePaymentTrialLoading(),
            alert(e.error_server_string(t.status));
        }
        $.ajax({
          method: "POST",
          url: "/package/trial/start",
          data: {
            _token: _token,
            username: this.username,
            email: this.email,
            package: this.package.amount,
            items: this.getSelectedCodes(),
          },
        })
          .done(t.bind(this))
          .error(i.bind(this));
      }),
      (this.submitReward = function () {
        function t(e) {
          e.success
            ? (window.location = e.redirect)
            : (this.hideRewardButtonLoader(), this.showRewardError(e.msg));
        }
        function i(t) {
          this.hideRewardButtonLoader(),
            this.showRewardError(e.error_server(t.status));
        }
        var s = this.username,
          a = this.getSelected(),
          n = this.package.amount,
          o = this.getSelectedCodes();
        this.hideRewardError(),
          this.showRewardButtonLoader(),
          $.ajax({
            url: "/reward/avail/one-time",
            method: "GET",
            data: {
              username: s,
              package: n,
              items: o,
              country: a.country,
              gender: a.gender,
              delay: a.delay,
            },
          })
            .done(t.bind(this))
            .fail(i.bind(this));
      }),
      (this.completeRewardCheckout = function () {
        0 == this.selected_media.length
          ? alert(e.error_select_posts())
          : this.submitReward();
      }),
      (this.showRewardError = function (e) {
        this.view.payment_reward_error.find(".d").html(e),
          this.view.payment_reward_error.show();
      }),
      (this.hideRewardError = function () {
        this.view.payment_reward_error.hide();
      }),
      (this.showRewardButtonLoader = function () {
        this.view.payment_reward_button
          .addClass("loading")
          .prop("disabled", !0),
          this.view.payment_reward_button.find(".text").hide();
      }),
      (this.hideRewardButtonLoader = function () {
        this.view.payment_reward_button
          .removeClass("loading")
          .prop("disabled", !1),
          setTimeout(
            function (e) {
              this.view.payment_reward_button.find(".text").fadeIn("fast");
            }.bind(this),
            250
          );
      }),
      (this.showSelected = function () {
        this.summary.country
          .find("span")
          .text(this.country_select.find(".text").text()),
          this.summary.gender
            .find("span")
            .text(this.gender_select.find(".text").text()),
          this.summary.delay
            .find("span")
            .text(this.delay_select.find(".text").text()),
          this._payment.setTargeting(this.getSelected());
      }),
      (this.getSelected = function () {
        return {
          country: this.selected_country,
          gender: this.selected_gender,
          delay: this.selected_delay,
        };
      }),
      (this.changedPackage = function (e) {
        (this.package = this.getPackage(e)), this._promotion.fill(e);
      }),
      (this.changedCountry = function (e) {
        (this.selected_country = e),
          this.showSelected(),
          this.country_select.find("input").blur();
      }),
      (this.changedGender = function (e) {
        (this.selected_gender = e), this.showSelected();
      }),
      (this.changedDelay = function (e) {
        (this.selected_delay = e), this.showSelected();
      }),
      (this.setDefaultTargeting = function () {
        this.country_select.dropdown("set selected", "any"),
          this.gender_select.dropdown("set selected", "any"),
          this.delay_select.dropdown("set selected", "0"),
          this._payment.setTargeting(this.getSelected());
      }),
      (this.displayTrialTargeting = function () {
        this.targeting.section.addClass("trial"),
          this.targeting.section
            .find(".trial-message")
            .text(e.error_targeting_trial()),
          this.country_select.addClass("disabled"),
          this.gender_select.addClass("disabled"),
          this.delay_select.addClass("disabled");
      }),
      (this.displayDisabledTargeting = function () {
        this.targeting.section.addClass("unavailable"),
          this.targeting.section
            .find(".trial-message")
            .text(e.error_targeting_disabled_aug2019()),
          this.country_select.parents(".section").addClass("disabled"),
          this.country_select.addClass("disabled"),
          this.gender_select.parents(".section").addClass("disabled"),
          this.gender_select.addClass("disabled"),
          this.delay_select.parents(".section").addClass("disabled"),
          this.delay_select.addClass("disabled");
      }),
      (this.hideSummary = function () {
        this.summary_wrapper.hide();
      }),
      (this.showSummary = function () {
        this.summary_wrapper.show();
      }),
      (this.showTargeting = function () {
        this.targeting.section.addClass("expanded"),
          this.targeting.header
            .find(".text-button")
            .text(e.targeting_button_hide());
      }),
      (this.hideTargeting = function () {
        this.targeting.section.removeClass("expanded"),
          this.targeting.header.find(".text-button").text(e.targeting_button()),
          this.setDefaultTargeting();
      }),
      (this.showPaymentDetails = function () {
        this.view.payment_details.show();
      }),
      (this.hidePaymentDetails = function () {
        this.view.payment_details.hide();
      }),
      (this.showPaymentTrialForm = function (e) {
        this.view.payment_trial_form.show(),
          this.view.payment_trial_form.find("input").val(e);
      }),
      (this.hidePaymentTrialForm = function () {
        this.view.payment_trial_form.hide();
      }),
      (this.showRewardCheckout = function () {
        this.view.payment_reward.show();
      }),
      (this.hideRewardCheckout = function () {
        this.view.payment_reward.hide();
      }),
      (this.showPaymentProcessor = function () {
        this.view.payment_processor.show();
      }),
      (this.hidePaymentProcessor = function () {
        this.view.payment_processor.hide();
      }),
      (this.showPaymentTrialLoading = function () {
        this.view.payment_trial_button.addClass("loading").prop("disabled", !0),
          this.view.payment_trial_button.find(".text").hide();
      }),
      (this.hidePaymentTrialLoading = function () {
        this.view.payment_trial_button
          .removeClass("loading")
          .prop("disabled", !1),
          setTimeout(
            function (e) {
              this.view.payment_trial_button.find(".text").fadeIn("fast");
            }.bind(this),
            250
          );
      }),
      (this.showPaymentTrialError = function (e) {
        this.view.payment_trial_error.find(".d").text(e),
          this.view.payment_trial_error.show();
      }),
      (this.hidePaymentTrialError = function () {
        this.view.payment_trial_error.hide();
      }),
      (this.paymentTrialFormConfirm = function () {
        this.hidePaymentTrialError();
        var t = this.view.payment_trial_form.find("input").val();
        t
          ? ((this.email = t),
            this.showPaymentTrialLoading(),
            this.submitTrial())
          : this.showPaymentTrialError(e.error_email_trial());
      }),
      (this.hidePayment = function () {
        (this.payment_visible = !1),
          this.payment_wrapper.addClass("disabled"),
          this.hidePaymentDetails(),
          this.hidePaymentTrialForm(),
          this.hideSummary(),
          this.showPaymentDescription();
      }),
      (this.showPayment = function () {
        (this.payment_visible = !0),
          this.hidePaymentDescription(),
          this.trial
            ? (this.payment_wrapper.removeClass("disabled"),
              this.hideRewardCheckout(),
              this.hidePaymentDetails(),
              this.hidePaymentProcessor(),
              this.showSummary(),
              this.email
                ? this.showPaymentTrialForm(this.email)
                : this.showPaymentTrialForm(""))
            : this.isRewardApplicable()
            ? (this.payment_wrapper.removeClass("disabled"),
              this.hidePaymentDetails(),
              this.hidePaymentProcessor(),
              this.showSummary(),
              this.showRewardCheckout())
            : (this.payment_wrapper.removeClass("disabled"),
              this.hideRewardCheckout(),
              this.showPaymentDetails(),
              this.showSummary(),
              this._payment.setData(this.username, this.package));
      }),
      (this.updateSelected = function () {
        if (this.selected_media.length > 0) {
          this.payment_visible || this.showPayment(),
            this.trial ||
              (this.isRewardApplicable()
                ? t.deactivate()
                : t.update(this.package.amount));
          var e = Math.ceil(this.package.amount / this.selected_media.length);
          if (t && t.isApplied())
            var i = t.getSelectedUpgrade(),
              s = Math.ceil(i.amount / this.selected_media.length);
          else
            var i = 0,
              s = 0;
          for (var a = 0; a < this.selected_media.length; a++)
            s > 0
              ? this.selected_media[a].summary_el
                  .find(".package p")
                  .html(e + " <span class='upgrade'>(+" + s + ")</span>")
              : this.selected_media[a].summary_el.find(".package p").html(e);
        } else this.hidePayment(), t && (t.revert(), t.hideCard());
        this.updatePrice();
      }),
      (this.toggleMedia = function (t) {
        if (void 0 === t.selected || null === t.selected) {
          if (this.trial && this.selected_media.length >= 10)
            return void alert(e.error_trial_limit_posts());
          if (
            !this.trial &&
            this.package.amount <= 1e3 &&
            this.selected_media.length >= 20
          )
            return void alert(e.error_small_limit_posts());
          if (
            !this.trial &&
            this.package.amount > 1e3 &&
            this.selected_media.length >= 40
          )
            return void alert(e.error_large_limit_posts());
          t.el.addClass("selected"),
            (t.summary_el = this.appendSummaryItem(t.thumbnail)),
            t.summary_el
              .find(".remove")
              .on("click", this.toggleMedia.bind(this, t)),
            (t.selected = this.selected_media.push({
              code: t.code,
              el: t.el,
              summary_el: t.summary_el,
            }));
        } else {
          for (var i = 0; i < this.selected_media.length; i++)
            if (this.selected_media[i].code == t.code) {
              this.selected_media.splice(i, 1);
              break;
            }
          (t.selected = void 0),
            t.summary_el.remove(),
            (t.summary_el = null),
            t.el.removeClass("selected");
        }
        this.updateSelected();
        try {
          this.recalculateDelay();
        } catch (e) {
          console.log("recalculateDelay: failed");
        }
      }),
      (this.hideMediaError = function () {
        this.view.step_two_media_error.hide();
      }),
      (this.showMediaError = function (e) {
        this.view.step_two_media_error.find(".d").html(e),
          this.view.step_two_media_error.show();
      }),
      (this.showLoadMoreLoader = function () {
        this.view.step_two_media_more.addClass("loading"),
          this.view.step_two_media_more.find(".text").hide();
      }),
      (this.showLoadMore = function () {
        this.view.step_two_media_more.removeClass("loading"),
          this.view.step_two_media_more.find(".text").show(),
          this.view.step_two_media_more.show();
      }),
      (this.hideLoadMore = function () {
        this.view.step_two_media_more.hide();
      }),
      (this.displayLoadMore = function () {
        this.user_data.has_next_page
          ? this.showLoadMore()
          : this.hideLoadMore();
      }),
      (this.minutesToHoursString = function (t) {
        var i = Math.floor(t / 60),
          s = t % 60;
        if (0 == i) {
          i = "";
          var a = "";
        } else var a = e.delay_hours_logic(i) + " ";
        return a + " " + e.delay_minutes_logic(s);
      }),
      (this.recalculateDelay = function (e) {
        var t = [],
          i = this.delay_select.dropdown("get value");
        if (this.selected_media.length > 0)
          var s = Math.ceil(this.package.amount / this.selected_media.length),
            a = { value: s, text: this.minutesToHoursString(s), delay: void 0 };
        else
          var a = {
            value: this.package.amount,
            text: this.minutesToHoursString(this.package.amount),
            delay: void 0,
          };
        for (var n = 0; n < this.delay_values.length; n++) {
          if (!(this.delay_values[n].value < a.value)) {
            (a.delay = this.delay_values[n].value),
              t.push({
                value: this.delay_values[n].value,
                name: a.text,
                text: a.text,
              });
            break;
          }
          t.push({
            value: this.delay_values[n].value,
            name: this.delay_values[n].text,
            text: this.delay_values[n].text,
          });
        }
        this.delay_select.dropdown("setup menu", { values: t }),
          i > a.delay
            ? (this.delay_select.dropdown("set selected", a.delay),
              this.changedDelay(a.delay))
            : (this.delay_select.dropdown("set selected", i),
              this.changedDelay(i));
      }),
      (this.appendSummaryItem = function (e) {
        var t = this.summary.item_model.clone();
        return (
          t
            .find(".thumbnail")
            .attr(
              "style",
              "background:url(" + e + ");background-size:contain;"
            ),
          t.appendTo(this.summary.selected),
          t
        );
      }),
      (this.appendUserMediaPost = function (e) {
        var t = $(
            "<li style='background-color:#e0e0e0;background-image:url(/img/loader.svg)'></li>"
          ).appendTo(this.view.step_two_media_list),
          i = new Image();
        return (
          (i.src = e),
          (i.onload = function () {
            t.attr(
              "style",
              "background:url(" + e + ");background-size:contain;"
            );
          }),
          t
        );
      }),
      (this.requestMoreMediaFallback = function () {
        function t(t) {
          this.displayLoadMore(),
            t.success
              ? ((this.user_data.max_id = t.max_id),
                (this.user_data.has_next_page = t.has_next_page),
                (this.user_data.media = this.user_data.media.concat(t.media)),
                this.showUserMedia())
              : t.msg
              ? this.showMediaError(t.msg)
              : this.showMediaError(e.error_unknown());
        }
        function i(t) {
          this.displayLoadMore(), this.showMediaError(e.error_server(t.status));
        }
        this.hideMediaError(),
          this.showLoadMoreLoader(),
          $.ajax({
            method: "POST",
            url:
              "/user/" +
              this.username +
              "/media?max_id=" +
              this.user_data.max_id +
              "&pk=" +
              this.user_data.pk,
            data: { _token: _token },
          })
            .done(t.bind(this))
            .error(i.bind(this));
      }),
      (this.requestMoreMedia = function () {
        function e(e) {
          if (e) {
            var t = e.data.user.edge_owner_to_timeline_media;
            (this.user_data.has_next_page = t.page_info.has_next_page),
              (this.user_data.max_id = t.page_info.end_cursor),
              (this.user_data.media = this.user_data.media.concat(a(t.edges))),
              this.showUserMedia();
          } else this.requestMoreMediaFallback();
        }
        function t(e) {
          console.error(e), this.requestMoreMediaFallback();
        }
        this.hideMediaError(), this.showLoadMoreLoader();
        var i = {
          id: this.user_data.pk,
          first: 12,
          after: this.user_data.max_id,
        };
        $.ajax({
          type: "GET",
          url:
            "https://www.instagram.com/graphql/query/?query_hash=7c8a1055f69ff97dc201e752cf6f0093&variables=" +
            encodeURIComponent(JSON.stringify(i)),
        })
          .done(e.bind(this))
          .fail(t.bind(this));
      }),
      (this.requestInstagramDataFallback = function () {
        function t(t) {
          this.hideStepOneLoading(),
            t.success
              ? ((this.user_data = t),
                t.is_private
                  ? (this.hideStepOneLoading(),
                    this.showStepOneError(e.error_private()))
                  : t.has_media
                  ? this.showStepTwo()
                  : (this.hideStepOneLoading(),
                    this.showStepOneError(e.error_no_posts())))
              : t.msg
              ? this.showStepOneError(t.msg)
              : this.showStepOneError(e.error_unknown());
        }
        function i(t) {
          this.hideStepOneLoading(),
            this.showStepOneError(e.error_server(t.status));
        }
        $.ajax({
          method: "POST",
          url: "/user/" + this.username + "/media",
          data: { _token: _token },
        })
          .done(t.bind(this))
          .fail(i.bind(this));
      }),
      (this.requestInstagramData = function () {
        function t(e) {
          try {
            var t = e.match(/window\._sharedData = ([\s\S]*?});/),
              i = e.match(
                /window\.__additionalDataLoaded\(('[\s\S]*?',)([\s\S]*?})\);/
              );
            if (t && t[1])
              try {
                var s = JSON.parse(t[1]).entry_data.ProfilePage;
                if (s && s.length > 0 && s[0].graphql) return s[0].graphql.user;
              } catch (e) {
                console.error(e);
              }
            if (i && i[2])
              try {
                var a = JSON.parse(i[2]);
                if (a.data && a.data.graphql) return a.data.graphql.user;
              } catch (e) {
                console.error(e);
              }
          } catch (e) {
            console.error(e);
          }
          return !1;
        }
        function i(i) {
          var s = t(i);
          s
            ? (this.hideStepOneLoading(),
              (this.user_data = {
                username: s.username,
                pk: s.id,
                profile_picture: s.profile_pic_url,
                is_private: s.is_private,
              }),
              this.user_data.is_private
                ? (this.hideStepOneLoading(),
                  this.showStepOneError(e.error_private()))
                : ((this.user_data.total_posts =
                    s.edge_owner_to_timeline_media.count),
                  (this.user_data.has_media =
                    s.edge_owner_to_timeline_media.count > 0),
                  (this.user_data.has_next_page =
                    s.edge_owner_to_timeline_media.page_info.has_next_page),
                  (this.user_data.max_id =
                    s.edge_owner_to_timeline_media.page_info.end_cursor),
                  (this.user_data.media = []),
                  this.user_data.has_media
                    ? ((this.user_data.media = this.user_data.media.concat(
                        a(s.edge_owner_to_timeline_media.edges)
                      )),
                      this.showStepTwo())
                    : (this.hideStepOneLoading(),
                      this.showStepOneError(e.error_no_posts()))))
            : this.requestInstagramDataFallback();
        }
        function s(e) {
          console.error(e), this.requestInstagramDataFallback();
        }
        $.ajax({
          method: "GET",
          url: "https://www.instagram.com/" + this.username + "/",
        })
          .done(i.bind(this))
          .fail(s.bind(this));
      }),
      (this.clearSelectedMedia = function () {
        for (var e = 0; e < this.selected_media.length; e++)
          this.selected_media[e].summary_el.remove();
        this.selected_media = [];
      }),
      (this.clearUserMedia = function () {
        this.view.step_two_media_list.html("");
      }),
      (this.showUserMedia = function () {
        for (var e = 0; e < this.user_data.media.length; e++)
          (void 0 !== this.user_data.media[e].el &&
            null !== this.user_data.media[e].el) ||
            ((this.user_data.media[e].el = this.appendUserMediaPost(
              this.user_data.media[e].thumbnail
            )),
            this.user_data.media[e].el.on(
              "click",
              this.toggleMedia.bind(this, this.user_data.media[e])
            ));
        this.displayLoadMore();
      }),
      (this.showUserDetails = function () {
        this.view.step_two_user.find(".photo .loader").show();
        var t = new Image();
        (t.src = this.user_data.profile_picture),
          (t.onload = function () {
            this.view.step_two_user.find(".photo .loader").hide(),
              this.view.step_two_user
                .find(".photo")
                .attr(
                  "style",
                  'background-image:url("' +
                    t.src +
                    '");background-size:cover;background-position:center;'
                );
          }.bind(this)),
          (t.onerror = function (e) {
            this.view.step_two_user.find(".photo .loader").hide(),
              this.view.step_two_user
                .find(".photo")
                .attr(
                  "style",
                  'background-image:url("/img/user.svg");background-size:cover;background-position:center;'
                );
          }.bind(this)),
          this.view.step_two_user
            .find(".username")
            .text(this.user_data.username),
          0 == this.package.price
            ? this.view.step_two_user
                .find(".likes")
                .html(e.details_account_selected_free(this.package.amount))
            : this.isRewardApplicable()
            ? this.view.step_two_user
                .find(".likes")
                .html(e.details_account_selected_free(this.package.amount))
            : this.view.step_two_user
                .find(".likes")
                .html(
                  e.details_account_selected_paid(
                    this.package.amount,
                    this.package.price
                  )
                );
      }),
      (this.showStepTwo = function () {
        this.view.step_one.hide(),
          this.showUserDetails(),
          this.showUserMedia(),
          this.setPaymentDescription(e.payment_description_posts()),
          this.view.step_two.show();
      }),
      (this.showStepOne = function () {
        this.view.step_two.hide(),
          this.clearSelectedMedia(),
          this.updateSelected(),
          this.clearUserMedia(),
          this.setPaymentDescription(e.payment_description_name()),
          this.view.step_one.show();
      }),
      (this.showStepOneError = function (e) {
        this.view.step_one_error.find(".d").html(e),
          this.view.step_one_error.show();
      }),
      (this.hideStepOneError = function () {
        this.view.step_one_error.hide();
      }),
      (this.showStepOneLoading = function () {
        this.view.step_one_continue.prop("disabled", !0),
          this.view.step_one_continue.addClass("loading"),
          this.view.step_one_continue.find(".text").hide();
      }),
      (this.hideStepOneLoading = function () {
        this.view.step_one_continue.attr("disabled", !1),
          this.view.step_one_continue.removeClass("loading"),
          this.view.step_one_continue.find(".text").show();
      }),
      (this.confirmStepOne = function () {
        if (
          ((this.username = this.view.username.find("input").val()),
          this.hideStepOneError(),
          this.package)
        )
          if (this.username) {
            this.showStepOneLoading(), this.requestInstagramData();
            try {
              this.recalculateDelay();
            } catch (e) {
              console.log("recalculateDelay: failed");
            }
          } else this.showStepOneError(e.error_username());
        else this.showStepOneError(e.error_package());
      }),
      (this.setUsername = function (e) {
        this.view.username.find("input").val(e);
      }),
      (this.setTitle = function (e) {
        this.view.checkout_title.text(e);
      }),
      (this.setDescription = function (e) {
        this.view.step_one_descr.text(e);
      }),
      (this.setStepTwoDescription = function (e) {
        this.view.step_two_descr.text(e);
      }),
      (this.setPaymentDescription = function (e) {
        this.view.payment_description.html(e);
      }),
      (this.showPaymentDescription = function () {
        this.view.payment_description.show();
      }),
      (this.hidePaymentDescription = function () {
        this.view.payment_description.hide();
      }),
      (this.setPaymentNotification = function (e) {
        this.view.payment_notification.html(e);
      }),
      (this.initPackages = function () {
        for (var t = 0; t < this.packages.length; t++) {
          var i = $(
            '<div class="item" data-selected="false" data-value="' +
              this.packages[t].amount +
              '">' +
              e.details_select_package(
                this.packages[t].amount,
                this.packages[t].price
              )
          ).appendTo(this.package_select.find(".menu"));
          (0 == this.packages[t].price ||
            (this.reward && this.packages[t].amount == this.reward.package)) &&
            i.find(".right").text(e.price_free()),
            this.packages[t].amount == this.package.amount &&
              i.attr("data-selected", "true");
        }
      }),
      (this.initListeners = function () {
        $(".checkout-extra-box").on("click", ".box-close", function (e) {
          $(e.delegateTarget).hide();
        }),
          this.targeting.header.on(
            "click",
            function () {
              this.targeting.section.hasClass("expanded")
                ? this.hideTargeting()
                : this.showTargeting();
            }.bind(this)
          ),
          this.view.step_one_form.on(
            "submit",
            function (e) {
              e.preventDefault(), this.confirmStepOne();
            }.bind(this)
          ),
          this.view.step_two_back.on("click", this.showStepOne.bind(this)),
          this.view.step_two_media_more.on(
            "click",
            this.requestMoreMedia.bind(this)
          ),
          this.view.payment_reward_button.on(
            "click",
            this.completeRewardCheckout.bind(this)
          ),
          this.trial
            ? this.view.payment_trial_form.on(
                "submit",
                function (e) {
                  e.preventDefault(), this.paymentTrialFormConfirm();
                }.bind(this)
              )
            : this._payment.initListeners();
      }),
      (this.initLayout = function (t, i) {
        this.setUsername(this.username),
          this.setDefaultTargeting(),
          this.setPaymentDescription(e.payment_description_name()),
          this.trial
            ? (this.displayTrialTargeting(),
              this.setTitle(e.trial_title()),
              this.setDescription(e.trial_text()),
              this.setStepTwoDescription(e.trial_media_text()))
            : (this.displayDisabledTargeting(),
              this._payment.initLayout(t, i),
              this._payment.setAccount(this.account)),
          this.username &&
            (this.showStepOneLoading(), this.requestInstagramData()),
          $(".dropdown").length &&
            ($(
              ".box-form .ui.dropdown .menu, .box-form .ui.dropdown .text,  .box-form .ui.dropdown i"
            ).css("opacity", "1"),
            $(".dropdown").each(function (e, t) {
              var i = $(this);
              $(this)
                .find(".menu .item")
                .each(function (e, t) {
                  $(this).data("selected") &&
                    i.dropdown("set selected", $(this).data("value"));
                });
            }));
      }),
      (this.init = function (e, t, i, s, a, n, o, h) {
        return (
          (this.username = e),
          (this.packages = t),
          (this.trial = s),
          (this.reward = a),
          (this.account = n),
          i
            ? ((this.package = this.getPackage(i)),
              void 0 == this.package && (this.package = this.getPackage(500)))
            : (this.package = this.getPackage(500)),
          this.initPackages(),
          this.package_select.dropdown({
            onChange: this.changedPackage.bind(this),
          }),
          this.country_select.dropdown({
            onChange: this.changedCountry.bind(this),
          }),
          this.gender_select.dropdown({
            onChange: this.changedGender.bind(this),
          }),
          this.delay_select.dropdown({
            onChange: this.changedDelay.bind(this),
          }),
          this.hideSummary(),
          this.initListeners(),
          this.initLayout(o, h),
          this._payment.setUpsaleObject(this._upsale),
          this
        );
      });
  },
  Promotion = function (e, t) {
    (this.default_package = "1000"),
      (this.element = $("#checkout-promotion")),
      (this.element_text = this.element.find(".box-text")),
      (this.element_button = $("#checkout-promotion-button")),
      this.package,
      this.package_object,
      (this.getSubscription = function (e) {
        for (var i = 0; i < t.length; i++) {
          if (t[i].package == e) return t[i];
          if (t[i].package > e) return t[i];
        }
        if (e > t[t.length - 1].package) return t[t.length - 1];
      }),
      (this.getPackageInfo = function (e) {
        if (isNaN(parseFloat(e)))
          var t = this.getSubscription(this.default_package);
        else var t = this.getSubscription(e);
        return t || null;
      }),
      (this.getSelection = function () {
        return this.package ? this.getPackageInfo(this.package) : null;
      }),
      (this.fill = function (t) {
        t && (this.package = t),
          (this.package_object = this.getSelection()) &&
            (this.element_text.html(
              e.promotion_subscriptions_text(
                this.package_object.package,
                this.package_object.price
              )
            ),
            this.element_button.attr(
              "href",
              "/package/" + this.package_object.package + "/subscribe"
            ));
      }),
      (this.show = function () {}),
      (this.hide = function () {
        this.element.hide();
      }),
      (this.init = function (e) {
        return this.fill(e), this.show(), this;
      });
  },
  Upsale = function (e, t) {
    (this.popup = $("#upsale-popup")),
      (this.card = $("#summary-upgrade")),
      (this.card_button = $("#summary-apply-button")),
      (this.card_undo_button = $("#summary-undo-button")),
      this.mode,
      this.selected_upgrade,
      (this.active = !0),
      (this.applied = !1),
      (this.upgrades = t),
      (this.getMode = function () {
        return this.mode;
      }),
      (this.isApplied = function () {
        return this.applied;
      }),
      (this.isActive = function () {
        return this.active;
      }),
      (this.getSelectedUpgrade = function () {
        return this.selected_upgrade;
      }),
      (this.activate = function () {
        this.active = !0;
      }),
      (this.deactivate = function () {
        (this.active = !1), this.hideCard();
      }),
      (this.revert = function () {
        this.applied = !1;
      }),
      (this.apply = function () {
        this.applied = !0;
      }),
      (this.getUpgrade = function (e) {
        for (var t = 0; this.upgrades.length; t++)
          if (this.upgrades[t].selected == e) return this.upgrades[t];
        return null;
      }),
      (this.revertCard = function () {
        this.revert(),
          this.updateCard(this.selected_upgrade.selected),
          checkout.updateSelected();
      }),
      (this.applyCard = function () {
        this.apply(),
          this.card.addClass("applied"),
          this.card
            .find("p")
            .html(
              e.upsale_applied_text(
                this.selected_upgrade.amount,
                this.selected_upgrade.price
              )
            ),
          checkout.updateSelected();
      }),
      (this.updateCard = function (t) {
        var i = this.getUpgrade(t);
        i
          ? this.isApplied() ||
            ((this.selected_upgrade = i),
            this.card.removeClass("applied"),
            this.card.find("h3").text(e.upsale_title()),
            this.card
              .find("p")
              .html(
                e.upsale_text(
                  this.selected_upgrade.amount,
                  this.selected_upgrade.price,
                  this.selected_upgrade.discount
                )
              ),
            this.showCard())
          : this.hideCard();
      }),
      (this.hideCard = function () {
        this.card.hide();
      }),
      (this.showCard = function () {
        this.card.show();
      }),
      (this.initCardListeners = function () {
        this.card_undo_button.on("click", this.revertCard.bind(this)),
          this.card_button.on("click", this.applyCard.bind(this));
      }),
      (this.initCard = function () {
        this.initCardListeners();
      }),
      (this.updatePopup = function (e) {
        var t = this.getUpgrade(e);
        this.selected_upgrade = t || null;
      }),
      (this._showPopup = function () {
        this.popup.find(".inner").outerHeight() + 25 > $(window).height() &&
          this.popup.find(".inner").addClass("espace"),
          $("body,html").addClass("noscroll");
      }),
      (this.generatePopupItems = function () {
        var e = checkout.getSelectedMedia(),
          t = this.popup.find("#upsale-popup-photos"),
          i = Math.ceil(checkout.package.amount / e.length),
          s = Math.ceil(this.selected_upgrade.amount / e.length);
        t.html("");
        for (var a = 0; a < e.length; a++) {
          $(
            '<div class="row"><div class="photo"><div class="img" style="background:url(https://www.instagram.com/p/' +
              e[a].code +
              '/media/?size=t);background-size:contain;"></div></div><div class="package">' +
              i +
              ' <span class="upgrade">(+' +
              s +
              ")</span></div></div>"
          ).appendTo(t);
        }
      }),
      (this.showPopup = function () {
        this.popup.show(),
          this.popup.addClass("opened"),
          this.popup
            .find(".upgrade-information")
            .html(
              'Increase your package by <span class="upgrade-amount" style="color: #9770ff;font-weight: 800;">' +
                this.selected_upgrade.amount +
                ' additional likes</span> for only <span class="upgrade-price">$' +
                this.selected_upgrade.price +
                '</span> extra! You get it at <span class="upgrade-discount" style="color: #9770ff;font-weight: 800;">' +
                this.selected_upgrade.discount +
                " discount</span>!"
            ),
          this.generatePopupItems(),
          this._showPopup();
      }),
      (this.hidePopup = function () {
        setTimeout(
          function () {
            this.popup.fadeOut("fast"), this.popup.removeClass("opened");
          }.bind(this),
          100
        ),
          $("body,html").removeClass("noscroll");
      }),
      (this.initPopupListeners = function () {
        this.popup.find("#upsale-popup-accept-button").on(
          "click",
          function (e) {
            this.apply(),
              this.hidePopup(),
              checkout.updateSelected(),
              checkout.submit();
          }.bind(this)
        ),
          this.popup.find("#upsale-popup-decline-button").on(
            "click",
            function (e) {
              this.revert(),
                checkout.updateSelected(),
                this.hidePopup(),
                checkout.submit();
            }.bind(this)
          ),
          $(document).on(
            "click",
            ".popup .inner .close, .popup .inner .close-popup",
            function (e) {
              e.stopPropagation(),
                e.preventDefault(),
                this.revert(),
                checkout.updateSelected(),
                this.hidePopup(),
                checkout.submit();
            }.bind(this)
          ),
          $(document).on(
            "click touchstart",
            function (e) {
              $(".popup.opened").is(e.target) &&
                0 === $(".popup.opened").has(e.target).length &&
                (e.stopPropagation(),
                e.preventDefault(),
                this.revert(),
                checkout.updateSelected(),
                this.hidePopup(),
                checkout.submit());
            }.bind(this)
          );
      }),
      (this.initPopup = function () {
        this.initPopupListeners();
      }),
      (this.update = function (e) {
        this.activate(),
          "card" == this.mode ? this.updateCard(e) : this.updatePopup(e);
      }),
      (this.init = function (e) {
        if (((this.mode = e), "popup" === this.mode)) this.initPopup();
        else {
          if ("card" !== this.mode) return !1;
          this.initCard();
        }
        return this;
      });
  };
