var updateXml = document.getElementById('updateXml');

updateXml.addEventListener('click', function () {
    fetch('/', {
        method: 'put',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'id': $(".modal-body #xId").val(),
            'xml': $(".modal-body #xXml").val()
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        // console.log(data)
        window.location.reload(true)
    })
})

$(document).on("click", ".deleteXml", function() {
    var xId = $(this).data('id');
    
    fetch('/', {
        method: 'delete',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            'id': xId
        })
    })
    .then(res => {
        if (res.ok) return res.json()
    })
    .then(data => {
        console.log(data)
        window.location.reload(true)
    })
})
