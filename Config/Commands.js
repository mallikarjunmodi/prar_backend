const bpOn =  ["0X55", "0XAA", "0X04", "0X02", "0X01" , "0XF8"] ;
const ecgOn  = ["0x55", "0xAA" ,"0x04","0x01" ,"0x01", "0xF9"];
const ecgwave = ["0x55", "0xAA" ,"0x04","0xFB" ,"0x01", "0xFF"];
const spOn  = ["0x55", "0xAA" ,"0x04","0x03" ,"0x01", "0xF7"];
const spwaveOn  = ["0x55", "0xAA" ,"0x04","0xFE" ,"0x01", "0xFC"];

const ecgoff  = ["0x55", "0xAA" ,"0x04","0x01" ,"0x00", "0xFA"];
const spoff  = ["0x55", "0xAA" ,"0x04","0x03" ,"0x00", "0xF8"];
const bpoff  = ["0x55", "0xAA"," 0x04", "0x02", "0x00", "0xF9"]
const ecgwaveoff  = ["0x55", "0xAA" ,"0x04","0xFB" ,"0x00", "0x00"];
const spwaveoff  = ["0x55", "0xAA" ,"0x04","0xFE" ,"0x00", "0xFD"];
const respoff  = ["0x55", "0xAA" ,"0x04","0xFF" ,"0x00", "0xFC"];


export const commands = {
    bp : [bpoff,ecgoff,spoff,ecgwaveoff,respoff,spwaveoff,bpOn] ,
    bg : [ecgoff,spoff,ecgwaveoff,respoff,bpoff] ,
    ecg : [spoff,ecgwaveoff,respoff,bpoff,ecgOn] ,
    hr : [spoff,spwaveoff,ecgoff,ecgwaveoff,respoff,spOn] ,
    hroff: [spoff]
}