import moment from 'moment';

    function log(origin, message){
        let date = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
        console.log('> ' + date + ': [' + origin + '] ' + message);
    }

export default log;