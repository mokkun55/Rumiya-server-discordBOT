const { Client,
        Events,
        GatewayIntentBits } = require("discord.js");
require('dotenv').config();

const client = new Client({
  intents: Object.values(GatewayIntentBits).reduce((a, b) => a | b),
  restTimeOffset: 100
});

// ---ここまでおまじない---


// ---botが起動したとき---
client.on("ready", () => {
  console.log(`${client.user.tag} でログインしています。`);
});


// ---!コマンド---
const prefix = "!"; //コマンド頭文字
client.on(Events.MessageCreate, async (message) => {
    if (!message.content.startsWith(prefix)) {
        return;
    }
    
    const [command, ...args] = message.content.slice(prefix.length).split(/\s+/);
    
    if (command === "hello") {
        await message.reply("HELLO!!");
    }

    //数字を全部足す
    if (command === "plus") { 
        let result = 0;
        for (const number of args){
            result += Number(number);
        }
        await message.channel.send(String(result)); //送られてきたchにメッセージをsend
    }

    //ランダム分配
    if (command === "team") {
        const VCchannel = message.member.voice.channel; //発言者が入っているVC
        if (!VCchannel) { //vc入ってないとき
            message.reply("VCに入っていません")
            return;
        }

        const VCmembers = VCchannel.members.map(member => member.user.globalName) //入っている人を配列にする
        // VCmembers = ["1", "2", "3", "4", "5", "6", "7", "8"] テスト用
        const RandomVCmembers = VCmembers.sort((a, b) => 0.5 - Math.random()); //配列をランダムに並び替え

                                // ---エラー条件---
        if (args[0] <= 1) { //チーム数が0以下のとき
            message.reply("チーム数は2以上の数で指定してください。")
            return;
        }
        if (VCmembers.length < args[0]) { //人数>チーム数になったとき
            message.reply("チーム数が不正です。")
            return;
        }
        if (VCmembers.length % args[0] !== 0) { //割ったとき0にならなかったとき
            message.reply("人数がチーム数の倍数でないため、公平なチーム分けができません。")
            return;
        }
        
        // console.log(RandomVCmembers);
        const teamSize = RandomVCmembers.length / args[0]; // チームごとの人数を計算
        const teams = [];
        for (let i = 0; i < args[0]; i++) {
            const team = RandomVCmembers.slice(i * teamSize, (i + 1) * teamSize); // チームごとに分割
            teams.push(team);
        }
        console.log(teams);

        message.reply(`VCに入っている**${VCmembers.length}人**を**${args[0]}チーム**に分けます\n${teams.map((team, index) => `チーム${index + 1}: ${team.join(", ")}`).join("\n")}`)
        
    }
})

// ---vcに接続したら---
client.on("voiceStateUpdate", (oldState, newState) => {
    if (newState.channel) {
        // console.log(`${newState.member.displayName} >> ${newState.channel.name}に接続しました`);
        if (newState.channel.name === "ひましてる（新）") { // ひましてる新に接続された処理
            if (newState.channel.members.size === 1) { //もし、１人なら
                console.log(`${newState.member.displayName} がVCに一人で接続しました`);
                //募集 509549950766415872 BOT 944957997271101470
                newState.guild.channels.resolve('944957997271101470')?.send(`${newState.member.displayName} が一人でVCに接続しました。\n 募集するときは下のリアクションを押してください。`)
                .then((sentMessage) => {
                    sentMessage.react('☑');
                })
                
            }
        }
    }
});


client.login(process.env.TOKEN);