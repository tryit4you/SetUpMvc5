var geojs;
var myLayer;
$(function () {
    $('#DetailObjectProperties').hide();
    register();
    //Khởi tạo bản đồ với tham số mặc định
    InitialMap(16.036918, 108.218510, 8);
    // loadTreeList();
    $('.tree li:has(ul)').addClass('parent_li').find(' > span');
    $('.tree li.parent_li > span').on('click', function (e) {
        var children = $(this).parent('li.parent_li').find(' > ul > li');
        if (children.is(":visible")) {
            children.hide('fast');
        } else {
            $(this).parent('li.parent_li').children().removeAttr('style');
            children.show('fast');
        }

        e.stopPropagation();
    });
    $('.level1').find("ul").hide();
    $('.tree').ready(function () {
        $('.tree').fadeIn(2000);
    });
});
//Hàm khởi tạo bản đồ với tham số lat,lng
function InitialMap(lat, lng, zoom) {
    var paramMapDefault = {
        lat: lat,
        lng: lng,
        zoom: zoom,
        mode: "2d"
    };
    paramMap = {
        mode: paramMapDefault.mode,
        center: { lat: paramMapDefault.lat, lon: paramMapDefault.lng },
        tilt: 60,
        rotation: 0,
        zoom: paramMapDefault.zoom,
        plugins: [
            //MapGL.SearchComponent
        ]
    };
    map = MapGL.initMap("xinkciti-map", paramMap);
    myLayer = new L.GeoJSON().addTo(map.leaflet);
}

//Hàm khởi tạo sự kiện khi click, hoặc thao tác với giao diện
function register() {
    $('#close-popup').click(function () {
        $('#DetailObjectProperties').fadeOut(1000);
    });
    $('.polygonItems').off('click').on('click', function (e) {
        $('.polygonItems').removeClass('active');
        //e.preventDefault();
        var code = $(this).data('id');
        var cityId = $(this).data('city');
        $(this).addClass('active');
        setTimeout(function () {
            getDetail(code);
            $('#DetailObjectProperties').show();

            getShapes(code);
        }, 200);
    });
    $('.polygonItems-district').off('click').delay(2000).on('click', function (e) {
        $('.polygonItems-dictrict').removeClass('active');
        e.preventDefault();
        var code = $(this).data('id');
        $(this).addClass('active');
        setTimeout(function () {
            getDetail(code);
            getShapes(code);
            $('#DetailObjectProperties').show();
        }, 300);
        });
    $('.polygonItems-ward').off('click').delay(2000).on('click', function (e) {
        $('.polygonItems-ward').removeClass('active');
        e.preventDefault();
        $(this).addClass('active');
        var code = $(this).data('id');
        setTimeout(function () {
            getDetail(code);
            getShapes(code);
            $('#DetailObjectProperties').show();
        }, 300);
    });
    $("#menu-close").on('click', function (e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });
    $("#menu-toggle").on('click', function (e) {
        e.preventDefault();
        $("#sidebar-wrapper").toggleClass("active");
    });
}

//Hàm vẽ đường viền của tỉnh thành phố, quận huyện...
//shapes tham số là dữ liệu để vẽ vào leafletjs
function drawPolygon(shapes, pointCenter, zoom) {
    if (pointCenter !== null) {
        map.leaflet.setView(new L.LatLng(pointCenter.Lat, pointCenter.Lng), zoom);
    }
    if (geojs !== undefined) {
        $.each(myLayer.getLayers(), function (i, data) {
            if (data.feature.properties.id === geojs.properties.id) {
                data.removeFrom(myLayer);
            }
        });
    }
    if (shapes.length !== 0) {
        var jsonObj = JSON.parse(shapes);
        geojs = jsonObj;
        myLayer.addData(geojs);
    }
}
//Hàm lấy dữ liệu truyền vào hàm vẽ
function getShapes(code) {
    var zoom = 0;
    $.ajax({
        url: '/drawpolygon/GetShapes',
        data: {
            code: code
        },
        type: 'post',
        dataType: 'json',
        success: function (res) {
            switch (code.length) {
                case 6:
                    zoom = 8;
                    break;
                case 9:
                    zoom = 10;
                    break;
                case 12:
                    zoom = 12;
                    break;
                default:
                    zoom = 8;
                    break;
            }
            var shapes = res.shapes;
            var pointCenter = res.pointCenter;

            drawPolygon(shapes, pointCenter, zoom);
        },
        error: function (error) {
            toastr.error("Vui lòng không click quá nhanh");
            location.reload();
            return false;
        }
    });
}

//Hàm lấy thông tin về tỉnh thành phố ,quận huyện đang chọn
function getDetail(code) {
    $.ajax({
        url: '/polygondetail/GetDetailObject',
        type: 'post',
        data: { code: code },
        dataType: 'json',
        success: function (res) {
            $('#DetailObjectProperties').html('');
            var html = res.htmlCode;
            $('#DetailObjectProperties').html(html);
            register();
        },
        error: function (error) {
            toastr.error("Vui lòng không click quá nhanh");
            location.reload();
            return false;
        }
    });
}