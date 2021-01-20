declare var $: any;
export function notify(message,type) {
    //const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);
    $.notifyClose();
    $.notify({
        icon: "notifications",
        message: message

    },{
        type: type,
        timer: 2000,
        placement: {
            from: 'top',
            align: 'right'
        }
    });
}

