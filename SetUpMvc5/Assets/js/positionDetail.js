$(function () {
    //Khởi tạo bản đồ với tham số mặc định
    InitialMap(16.036918, 108.218510);
});

//Hàm khởi tạo bản đồ với tham số lat,lng
function InitialMap(lat, lng, message) {
    var paramMapDefault = {
        lat: 16.036918,
        lng: 108.218510,
        zoom: 8,
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
    map.leaflet.on('click', function (e) {
        getPolygonDetail(e.latlng.lat, e.latlng.lng);
    });
}

//Hàm hiển thị popup lên map
function getPolygonDetail(lat, lng) {
    var optimizeValue = $("input:radio[name='optradio']:checked").val();
    $.ajax({
        url: '/polygondetail/GetDetailByLatLng',
        data: {
            lat: lat,
            lng: lng,
            optimizeValue: optimizeValue
        },
        type: 'post',
        dataType: 'json',
        success: function (res) {
            var timeQuery = res.timeQuery;
            if (timeQuery !== '') {
                toastr.success("Thời gian thực hiện: " + timeQuery + "<sub>(ms)</sub>");
            }
            var message = '';
            if (res.details.Ward === '' || res.details.District === '' || res.details.City === '') {
                message = '<b>Chưa có địa điểm này trên bản đồ</b>';
            } else {
                message = "<div style='display: inline-flex;'><div style='margin-right: 5px;'><img style='height: 30px;width: 30px;max-width: none;' src='/Assets/uploads/view.png' /></div><div><b>" + res.details.Ward + "," + res.details.District + "," + res.details.City + "</b><br/>" + lat + "," + lng + "</div>";
            }
            if (message !== undefined) {
                L.popup()
                    .setLatLng([lat, lng])
                    .setContent(message)
                    .openOn(map.leaflet);
            }
        }
    });
}