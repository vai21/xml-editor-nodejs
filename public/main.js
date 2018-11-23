var updateXml = document.getElementById('updateXml');
var deleteXml = document.getElementById('deleteXml');

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

if (deleteXml){
    deleteXml.addEventListener('click', function () {
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
}