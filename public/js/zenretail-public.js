
(function( $ ) {
    'use strict';
    var products = [];
    var filtered = [];
    var divSideBar = '';
    var translator;
  
    $(window).on("message", function(e) {
        const message = e.originalEvent.data;
        if (!message) { return; }

        if (message.indexOf('token:') === 0) {
            const token = message.replace('token:', '');
            if (token === '') {
                localStorage.removeItem('token');
            } else {
                localStorage.setItem('token', token);
            }
            getBasket();
        }
        if (message.indexOf('basket') === 0) {
            $(location).attr('href', '/zenretail/basket');
        }
        if (message.indexOf('iframe:') === 0) {
            const height = message.replace('iframe:', '');
            $('iframe').height(height);
        }
    });

    $(window).load(function() {
        getBasket();
        if (typeof search !== 'undefined') {
            showSearch();
            return;
        }
        const selectedValue = $('#selectedValue').val();
        if (selectedValue === '***') {
            getHome();
            return;
        }
        if ($('#category_info').length) {
            getProductsByCategory(selectedValue);
            return;
        }
        if ($('#brand_info').length) {
            getProductsByBrand(selectedValue);
            return;
        }
        if ($('#product_info').length) {
            getProduct(selectedValue);
            return;
        }
        if ($('#zenretail').length) {
            getWebretail(selectedValue);
            return;
        }
    });


    /// Common Methods

    function translatePage() {
        translator = $('body').translate({lang: locale.toLowerCase(), t: dict});
        var div = $('.entry-title').length ? $('.entry-title') : $('.title');
        var title = $(div).html()
        $(div).html(translator.get(title));
    }

    function restService(type, url, params, successCallback) {
        $.ajax({
            type: type,
            url: apiUrl + url,
            data: JSON.stringify(params),
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            success: successCallback,
            error: function (xhr, textStatus, errorThrown) {
                alert('Ops!  ' + xhr.status  + ' ' + errorThrown + ' ' + xhr.responseText);                    
                // if (xhr.status == 401) {
                //     $(location).attr('href','/authentication');
                // }
            }
        });
    }

    function getWebretail(page, div = '#zenretail') {
        translatePage();
        //const url = apiUrl.replace('8181', '8080') + (page !== '***' ? '/' + page : '/web/basket');
        if (page === 'basket' || page === '***') {
            page = 'web/' + page;
        }
        const url = apiUrl + '/' + page;
        $(div).append('<iframe src="' + url + '" width="100%" heigth="100%" sandbox="allow-same-origin allow-popups allow-scripts allow-forms allow-top-navigation" scrolling="no" frameBorder="0"></iframe>');
    }

    function getPrice(product) {
        var price = '&euro; ' + product.price.selling.toFixed(2);
        if (product.discount.price > 0) {
            price = '<del>' + price + '</del> -' + product.discount.percentage + '% &euro; ' + product.discount.price.toFixed(2)
        }
        return price;
    }
    
    function capitalize(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    function addSocial(name, desc) {
        $('#product_info').append('<div id="share"></div>');
        $('#share').jsSocials({
            url: $(location).attr('href'),
            text: name + ': ' + desc,
            showLabel: false,
            showCount: "inside",
            shares: ["twitter", "facebook", "googleplus", "linkedin", "whatsapp", "email"]
        });
    }

    function addSEO(title, desc) {
        var keys = $.map(desc.split(' '), function(item) {
            if (item.length > 4) {
                return item;
            }
        });

        $('meta[name=description]').remove();
        $('meta[name=keywords]').remove();
        $('head').append( '<meta name="description" content="' + desc + '">' );
        $('head').append( '<meta name="keywords" content="' + keys.join(',') + '">' );
        
        $('meta[property="og:title"]').remove();
        $('meta[property="og:description"]').remove();
        $('meta[property="og:url"]').remove();
        $("head").append('<meta property="og:title" content="' + title + '">');
        $("head").append('<meta property="og:description" content="' + desc + '">');
        $("head").append('<meta property="og:url" content="' + $(location).attr('href') + '">');
    }
    
    /// Home features

    function getHome() {
        translatePage();
        if (featured === "1") {
            getHomePart('Featured');
        }
        if (news === "1") {
            getHomePart('New');
        }
        if (sale === "1") {
            getHomePart('Sale');
        }
        if (brands === "1") {
            getBrands();
        }
    } 
    
    function getHomePart(name) {
        var url = '/api/ecommerce/' + name.toLowerCase();
        restService("GET", url, null,
            function (data, textStatus, xhr) {
                if (data.length > 0) {
                    $('#primary').append('<div class="wrap_products"><h3 class="trn">' + translator.get(name) + '</h3><div id="gallery_' + name + '" style="display:none;"></div></div><br/>');
                    $.each(data, function () {
                        var link = '/product/' + this.seo.permalink;
                        var image = this.medias.length > 0 ? this.medias[0].name : '';
                        $('#gallery_' + name).append(
                            '<a href="' + link + '">' +
                            '<img alt="' + this.productName + '<br/>' + this.brand.brandName + '<br/>' + getPrice(this) + '" ' +
                            'src="' + apiUrl + '/thumb/' + image + '" ' +
                            'data-image="' + apiUrl + '/media/' + image + '" ' +
                            'style="display:none">' +
                            '</a>'
                        );
                    });
                    showGalleryProduct('#gallery_' + name);
                }
            });
    }

    /// Brands

    function getBrands() {
        restService('GET', '/api/ecommerce/brand', null,
            function (data, textStatus, xhr) {
                if (data.length > 0) {
                    $('#secondary').append('<div class="wrap_products"><h3 class="trn">' + translator.get('Brands') + '</h3><div id="brands"></div></div>');
                    $.each(data, function () {
                        var url = apiUrl + '/thumb/' + (this.media.name);
                        $('#brands').append(
                            '<a href="/brand/' + this.seo.permalink + '">' +
                            '<img src="' + url + '" alt="' + this.brandName +'" title="' + this.brandName +'"></a>'
                        );
                    });
                }
            });
    }
    
    /// Products

    function getProductsByBrand(name) {
        var url = '/api/ecommerce/brand/' + name;
        getProducts(name, url, true);
    }

    function getProductsByCategory(name) {
        var url = '/api/ecommerce/category/' + name;
        if (name === 'new' || name === 'sale' || name === 'featured') {
            url = '/api/ecommerce/' + name;
        }
        getProducts(name, url);
    }

    function getProducts(name, url, isBrandPage = false) {        
        var div = isBrandPage ? '#brand_info' : '#category_info';
        divSideBar = $('.entry-header').length ? '.entry-header' : div;
        restService("GET", url, null,
            function (data, textStatus, xhr) {
                products = filtered = data;
                if (isBrandPage) {
                    $(divSideBar).append('<h1>' + data[0].brand.brandName + '</h1><br/>');
                } else {
                    var title = capitalize(name);
                    $.each(data[0].categories, function () {
                        if (this.category.seo.permalink === name) {
                            title = $.map(this.category.translations, function (item) {
                                if (item.country === locale) {
                                    return item.value;
                                }
                            });
                        }
                    });
                    $(divSideBar).append('<h1 class="trn">' + title + '</h1><br/>');
                }
                $(divSideBar).append('<div id="filters"><strong class="trn">Filters</strong></div>');      
                $(divSideBar).append('<div id="sorting"><strong class="trn">Sorting</strong></div><br/>');      
                $(div).append('<div id="gallery" style="display:none;"></div>');      
                refreshProducts();
                showLinks(div, name, isBrandPage);
            });
    }
    
    function refreshProducts() {
        $('#gallery').html('');
        $.each(filtered, function () {
            var link = '/product/' + this.seo.permalink;
            var name = this.medias.length > 0 ? this.medias[0].name : '';
            var desc = this.productName + '<br/>' + this.brand.brandName + '<br/>' + getPrice(this);
            $('#gallery').append(
                '<a href="' + link + '">' +
                '<img alt="' + desc + '" ' +
                'src="' + apiUrl + '/thumb/' + name + '" ' +
                'data-image="' + apiUrl + '/media/' + name + '" ' +
                'style="display:none">' +
                '</a>'
            );
        });
        showGalleryProduct('#gallery');
    }

    /// Links

    function showLinks(div, name, isBrandPage) {
        var divSideBar = $('.entry-header').length ? '.entry-header' : div;
        var brands = [];
        var subcategories = [];
        $.each(products, function () {
            $.each(this.categories, function (k, v) {
                if (v.category.categoryName.toLowerCase() !== name) {
                    if ($.map(subcategories, function (item) {
                        if (item.categoryName === v.category.categoryName) {
                            return item;
                        }
                    }).length === 0) {
                        subcategories.push(v.category);
                    }
                }
            });
            if (!isBrandPage) {
                var brand = this.brand.brandName;
                var id = $.map(brands, function (item) {
                    if (item.brandName === brand) {
                        return item.brandId;
                    }
                });
                if (id.length === 0) {
                    brands.push(this.brand);
                }
            }
        });
        
        $(divSideBar).append('<br/><div style="wrap_list"><strong class="trn">Categories</strong><div id="subcategories"></div></div>');
        $.each(subcategories, function () {
            var name = $.map(this.translations, function (item) {
                if (item.country === locale) {
                    return item.value;
                }
            });
            $('#subcategories').append('<a href="/category/' + this.seo.permalink + '">' + (name.length > 0 ? name : this.categoryName) + '</a><br/>');
        });

        $(divSideBar).append('<br/><div class="wrap_list"><strong class="trn">Brands</strong><div id="brands"></div><br/></div>');
        if (!isBrandPage) {
            $.each(brands, function () {
                $('#brands').append('<a href="/brand/' + this.seo.permalink + '">' + this.brandName + '</a><br/>');
            });
        }

        translatePage();
        addFilters(brands, subcategories);
        addSorting();
    }

    /// Filters

    function addFilters(brands, categories) {
        var nameFilter = $('<input/>', {
            placeholder: translator.get('by name'),
            class: 'trn',
            keyup: function () { filterByName(this.value); }
        });
        $('#filters').append(nameFilter);

        var brandFilter = $('<select/>', {
            change: function () { filterByBrand(this.value); }
        });
        $('<option />', {value: '', text: translator.get('by brand')}).appendTo(brandFilter);
        $.each(brands, function() {
            $('<option />', {value: this, text: this}).appendTo(brandFilter);
        });
        $('#filters').append(brandFilter);

        var categoryFilter = $('<select/>', {
            change: function () { filterByCategory(this.value); }
        });
        $('<option />', {value: 0, text: translator.get('by category')}).appendTo(categoryFilter);
        $.each(categories, function() {
            $('<option />', {value: this.categoryId, text: this.categoryName}).appendTo(categoryFilter);
        });
        $('#filters').append(categoryFilter);

        var priceFilter = $('<select/>', {
            change: function () { filterByPrice(this.value); }
        });
        $('<option />', {value: 0.0, text: translator.get('by price')}).appendTo(priceFilter);
        var prices = $.map(products, function (item) {
            return item.price.selling;
        });
        var maxPrice = Math.max.apply(Math, prices);
        var minPrice = Math.min.apply(Math, prices);
        do {
            $('<option />', {value: minPrice, text: minPrice}).appendTo(priceFilter);
            minPrice += 100.00;
        }
        while (minPrice < maxPrice);
        $('#filters').append(priceFilter);
    }
    
    function filterByBrand(brand) {
        filterProducts(brand, 0, '', 0);
    }

    function filterByCategory(category) {
        filterProducts('', category * 1, '', 0);
    }

    function filterByName(name) {
        filterProducts('', 0, name, 0);
    }

    function filterByPrice(price) {
        filterProducts('', 0, '', price * 1);
    }

    function filterProducts(brand, categoryId, name, price) {
        if (brand === '' && categoryId === 0 && name === '' && price === 0) {
            filtered = products;
        } else {
            filtered = [];
            $.each(products, function (key, value) {
                if (brand !== '' && value.brand.brandName === brand) {
                    filtered.push(value);
                    return;
                }
                if (categoryId > 0) {
                    $.each(value.categories, function (k, v) {
                        if (v.category.categoryId === categoryId) {
                            filtered.push(value);
                            return;
                        }
                    });
                }
                if (name !== '' && value.productName.indexOf(name) >= 0) {
                    filtered.push(value);
                    return;
                }
                if (price > 0 && value.item.price.selling <= price) {
                    filtered.push(value);
                }
            });
        }
        refreshProducts();
    }

    /// Sorting

    function addSorting() {
        var priceSorting = $('<select/>', {
            change: function () { orderByPrice(this.value); }
        });
        $('<option />', {value: 'min', text: translator.get('by min price')}).appendTo(priceSorting);
        $('<option />', {value: 'max', text: translator.get('by max price')}).appendTo(priceSorting);
        $('#sorting').append(priceSorting);
    }
    
    function orderByPrice(value) {
        filtered.sort(function(a, b) {
            if ( a.item.price.selling < b.item.price.selling )
                return value === 'min' ? -1 : 1;
            if ( a.item.price.selling > b.item.price.selling )
                return value === 'min' ? 1 : -1;
            return 0;
        });
        refreshProducts();
    }

    /// Product detail

    function getProduct(name) {
        restService("GET", '/api/ecommerce/product/' + name, null,
            function (data, textStatus, xhr) {
                showProduct(data);
            });
    }

    function showProduct(value) {
        divSideBar = $('.entry-header').length ? '.entry-header' : '#product_info';
        var desc = $.map(value.translations, function (item) {
            if (item.country == locale) {
                return item.value;
            }
        })[0];
        var category = '';
        $.each(value.categories, function() {
            category += $.map(this.category.translations, function (item) {
                if (item.country == locale) {
                    return '<li><strong>' + item.value + '</strong></li>';
                }
            });
        });
        $(divSideBar).append(
            '<h1>' + value.productName + '</h1>' +
            '<h3>' + desc + '</h3>' +
            '<br/><p><span class="trn">Brand</span><br/><strong>' + value.brand.brandName + '</strong></p>' +
            '<ul><span class="trn">Categories</span>' + category + '</ul>' +
            '<p><span class="trn">Price</span><br/><span class="price">' + getPrice(value) + '</span></p>'
        );
        addSEO(
            value.seo.title.length > 0 ? value.seo.title : value.productName,
            value.seo.description.length > 0 ? value.seo.description : desc
        );
        $('#product_info').append('<div id="gallery_' + value.productCode + '" style="display:none"></div><br/>');
        $.each(value.medias, function() {
            $('#gallery_' + value.productCode).append(
                '<img alt="' + this.name + '" ' +
                'src="' + apiUrl + '/thumb/' + this.name + '" ' +
                'data-image="' + apiUrl + '/media/' + this.name + '" ' +
                'style="display:none">'
            );
        });
        showGalleryImage('#gallery_' + value.productCode);       
        getWebretail('web/product/' + value.seo.permalink, '#product_info');
        translatePage();
        // addSocial(value.productName, desc);
    }
    
    function showGalleryProduct(name) {
        $(name).unitegallery({
            gallery_width:"100%",
            tile_link_newpage: false,
            tiles_col_width:230,
            tiles_space_between_cols:20,
            tile_enable_textpanel:true,
            tile_show_link_icon:true,
            tile_overlay_opacity:0.3,
            tile_enable_shadow:true,
            tile_image_effect_type:"sepia",
            tile_image_effect_reverse:true
            // tile_border_color:"#7a7a7a",
            // tile_outline_color:"#8B8B8B",
            // tile_shadow_color:"#8B8B8B",
            // lightbox_textpanel_title_color:"e5e5e5"
        });

        // $(name).unitegallery({
        //     tiles_type:"nested"
        // });
    }

    function showGalleryImage(name) {
        $(name).unitegallery({
            gallery_width:480,
            gallery_height:640,
            gallery_min_width: 240,
            gallery_min_height: 320
        });
    }

    /// Basket

    var count = 0.0;
    var amount = 0.0;

    function getBasket() {
        count = 0.0;
        amount = 0.0;
        $('.basketBadge').remove();
        var token = localStorage.getItem('token');       
        if (token) {
            restService('GET', '/api/ecommerce/basket', null,
                function (data, textStatus, xhr) {
                    $.each(data, function () {
                        count += this.basketQuantity;
                        amount += this.basketQuantity * this.basketPrice;
                    });
                    if (count > 0) {
                        $('.basket').append('<span class="basketBadge">' + count + '</span>');
                    }
                });
        }
    }

    /// Search

    function showSearch() {
        $.each(JSON.parse(search), function () {
            var desc = $.map(this.translations, function (item) {
                if (item.country == locale) {
                    return item.value;
                }
            })[0];
            var thumbnail = apiUrl + '/thumb/' + (this.medias.length > 0 ? this.medias[0].name : '');
            $('#main').append(
                '<article class="page type-page status-publish hentry">' +
                '<header class="entry-header">' +
                '<h2 class="entry-title"><a href="/product/' + this.seo.permalink + '" rel="bookmark">' + this.productName + '</a></h2>' +
                '</header>' +
                '<div class="entry-summary"><p>' + desc + '</p></div>' +
                '<div class="entry-thumbnail"><img src="' + thumbnail + '"</div>' +
                '</article>'
            );
        });
    }

})( jQuery );
