<template>
	<view class="forsageFAQ">
		<!-- <CustomBar class="topBar" :styles="{background: '#fff'}"/> -->
		<!-- <view></view> -->
		<!-- <text></text> -->
		<view class="FAQTop">
			<image src="../../static/image/forsage/explainTop.png"></image>
			<view class="FAQTopTitle">
				<view class="titleTop">
					<view class="titleTopText">
                        <image src="../../static/image/forsage/FAQ.png">
					</view>
					<view class="titleTopBorder"></view>
				</view>
				<!-- <view class="titlebottom">
					<view class="titlebottomText">Global Decentralized Ecosystem
					</view>

				</view> -->
			</view>

		</view>
        <view class="FAQList">
                    <view class="fold-list" v-for="(item,index) in list" :key="index">
                        <view  class="fold-listItem">
                            <view class="fold-listItemLeft">
                                <image src="../../static/image/forsage/FAQicon.png">
                               
                                </image>
                                 <text class="question">{{ 'Q'+(1+index) }}</text>
                                <view class="fold-title"  >{{item.title}}</view>
                            </view>
                            <view class="fold-listItemRight" @click="changeContent(index)">
                                <image v-if="!item.showContent" src="../../static/image/forsage/up.png"></image>
                                <image  v-else src="../../static/image/forsage/down.png"></image>
                            </view>
                        </view>
                        
                        <view class="fold-content" v-show="item.showContent" v-for="(itemMsg,indexMsg) in item.msg" :key="indexMsg" @click="changeContentInfo(index,indexMsg)">
                            {{itemMsg.content}}
                        </view>
                    </view>
                 </view>
            </view>
		<!-- <view class="explainTopIntroduce">
            <view>
                Decentralized marketing is powered by the revolutionary smart contract technology*. 
            </view>
            <view>
                The code for Forsage’s smart contract can be seen here fully open, so you can be completely confident in the security and long-term operation of the project.
            </view>
            <text class="explainTopIntroduceYuan topYuan"></text>
            <text class="explainTopIntroduceYuan bottomYuan"></text>
        </view> -->
       <!-- <view class="explainDetails">
           <view class="explainDetailItem" v-for="(item,index) in itemList" :key="index">
               <view class="explainDetailItemTop">
                   <image src="../../static/image/forsage/gift.png"></image>
               <view class="itemTopTitle">
                   {{ item.name }}
               </view>
               </view>
               <view  class="explainDetailItemBottom">
                   <view class="itemLine"></view>
                   <view class="itemBottomText">
                       {{ item.title }}
                   </view>
               </view>
           </view>
           <view class="explainDetailItem">
               <view class="explainDetailItemTop">
                   <image src="../../static/image/forsage/gift.png"></image>
               <view class="itemTopTitle">
                   100% ONLINE
               </view>
               </view>
               <view  class="explainDetailItemBottom">
                   <view class="itemLines"></view>
                   <view class="itemBottomText">
                       All funds are transferred between members, there are no hidden fees. The contract balance is always zero.
                   </view>
               </view>
           </view>
       </view> -->



	
</template>
<script>
// import {uniCollapse,uniCollapseItem} from "@dcloudio/uni-ui'"

	import CustomBar from "../../components/CustomBar";
	import NoDefaultWallet from "../../components/NoDefaultWallet";
	import {
		mapState,
		mapGetters
	} from "vuex";
	export default {
		data() {
			return {
                itemList:[
                    {
                        name:'ZERO RISK',
                        img:'../../static/image/forsage/down.png',
                        title:'On February 22, 2021, Forsage developers deployed a self-executing smart contract on the Thinkium Blockchain that exists in perpetuity and cannot be modified by any entity.'
                    },
                    {
                        name:'IMMUTABILITY OF CONDITIONS',
                        img:'../../static/image/forsage/down.png',
                        title:'The Forsage smart contract is nothing more than a payment gateway that facilitates peer-to-peer commission payments between its participants.'
                    },
                    {
                        name:'TRANSPARENCY AND ANONYMITY',
                        img:'../../static/image/forsage/down.png',
                        title:'The smart contract is public. Anyone can see the code and the entire transaction history. This guarantees the integrity of the system and real project statistics.'
                    },
                    {
                        name:'INSTANT TRANSACTIONS',
                        img:'../../static/image/forsage/down.png',
                        title:'The profit routes from other members directly into your personal wallet. There is no hoarding in the system, the income belongs only to you.'
                    },
                    {
                        name:'DECENTRALIZATION',
                        img:'../../static/image/forsage/down.png',
                        title:'There are no managers or administrators, there are only the creators who are equal participants in the project, like everyone else.'
                    },
                    // {
                    //     name:'100% ONLINE',
                    //     title:'All funds are transferred between members, there are no hidden fees. The contract balance is always zero.'
                    // }
                ],
                list:[
                    {title:'WHAT IS FORSAGE?',msg:[{content:'Forsage is the international community of the global decentralized ecosystem and the first ever smart contract marketing matrix of the Ethereum and Tron networks.This is a self-executing software algorithm that performs the function of distributing partner rewards between community members, subject to certain conditions (matrix marketing plan). The contract code is publicly available. Information about transactions in the Ethereum network can always be viewed at the link etherchain.org.'}],showContent:false},
                    {title:'WHO MANAGES THE PLATFORM?',msg:[{content:'The Forsage platform consists of self-executing trades, which do not permit anyone to interfere with the course of the transactions.'}],showContent:false},
                    {title:'WHO CREATED FORSAGE?',msg:[{content:'The Forsage concept belongs to a group of crypto enthusiasts, who are members of the community and don’t have any special privileges.Today, Forsage is an peer-to-peer community of platform members, to whom the platform itself belongs.'}],showContent:false},
                    {title:'WHAT IS ETHEREUM?',msg:[{content:'Ethereum (ETH) is one of the leading cryptocurrency, which has existed since 2015. At the same time, it is a software framework for the DeFi (decentralized finance) market, since the blockchain of this crypto currency allows you not only to follow the history of transactions, but also to save any executable software products (smart contracts). A huge number of major crypto companies use this platform.'}],showContent:false},
                    {title:'WHAT IS A SMART CONTRACT? WHAT ARE ITS ADVANTAGES?',msg:[{content:'A smart contract is an algorithm within a cryptocurrency’s blockchain. In our case, Ethereum is our first choice among those on which it is possible to create smart contracts. The main purpose of such contracts is the automation of the relationship, the opportunity to make a commitment self-executing.'}],showContent:false},
                    {title:'WHAT IS DECENTRALIZATION?',msg:[{content:'The process works based on distributing authority from a centralized administration to the participants involved in the process. Unlike a centralized system, all decisions are made by consensus.'}],showContent:false},
                    {title:'WHAT DO I NEED TO DO IN ORDER TO JOIN THE COMMUNITY?',msg:[{content:'To join the community, you need to install on your device (smartphone, tablet, PC) a crypto wallet and Telegram messenger tlgrm.ru'}],showContent:false},
                    {title:'WHICH WALLET SHOULD I USE?',msg:[{content:'Forsage works with all crypto wallets.When working with Forsage Ethereum, we recommend using:- for mobile devices (smartphone, tablet) Coinbase Wallet wallet.coinbase.com application,- Metamask metamask.io browser extension for computers and laptops.When working with Forsage Tron:- for all types of Tronlink tronlink.org devices.These wallets are among the most popular and demanded in the global cryptoindustry.'}],showContent:false},
                    {title:'WHERE CAN I GET MORE INFORMATION ABOUT FORSAGE?',msg:[{content:'We recommend subscribing to verified Forsage Telegram channels. There you can ask questions to participants who will be happy to share their experiences.Join the Telegram chat t.me/smartpeoplechat. We also recommend that you study the materials on the website in the "Academy" section.'}],showContent:false},
                    {title:'WHAT DO I NEED TO DO TO CREATE AN ETHEREUM WALLET?',msg:[{content:'For PC, you need to go to the metamask.io website and install the extension for your browser.For mobile devices, you need to install the Coinbase Wallet app wallet.coinbase.comWhen registering, do not forget to safely and securely save the passwords for accessing the wallet.'}],showContent:false},
                    {title:'HOW TO BUY / SELL ETHEREUM AND TRON IF I HAVE NEVER DEALT WITH CRYPTOCURRENCY?',msg:[{content:'There are many ways to buy / sell cryptocurrency for fiat money (currencies we are used to). All of them are designed for ordinary users and have an intuitive interface. The first operation will take you no more than 5 minutes on the site for exchanging fiat money for digital money. We recommend using the trusted exchanger aggregator bestchange.ru'}],showContent:false},
                    {title:'HOW CAN I REGISTER ON THE FORSAGE PLATFORM?',msg:[{content:'To register with Forsage Ethereum, you need to send 0.05 ETH to a smart contract to activate the X3 and X4 platforms. The fact of the transaction will be your registration on the platform.To register with Forsage Tron, you need to send 200 TRX to a smart contract to activate the X3 and X4 platforms, as well as 200 TRX for the xGold platform (after registration).Please note: when replenishing a crypto wallet, it is important to take into account the commission in the Ethereum network - about 0.02 ETH, in the Tron network - about 1 TRX.'}],showContent:false},
                    {title:'CAN I REGISTER ON THE WEBSITE WITHOUT A PARTNER LINK?',msg:[{content:'Yes. Registration without an invitation link will put you in the id 1 team.'}],showContent:false},
                    {title:'WHAT WILL HAPPEN TO MY ACCOUNT IF I TAKE A BREAK FROM WORKING WITH THE FORSAGE COMMUNITY?',msg:[{content:'No one can close your account, even if they have a strong desire to do so. The account will always be saved in one of the Ethereum network blocks. You will continue to receive income from all levels, except the last active one.'}],showContent:false},
                    {title:'I HAVE ACTIVATED THE PLATFORM, WHAT SHOULD I DO NEXT?',msg:[{content:'To effectively interact with the Forsage platform, you need:1. Talk to the person who invited you or other experienced participants - they will help you take the first steps.2. Go to section "Academy" with selected courses for successful work on the platform.'}],showContent:false},
                    {title:'HOW CAN I REACH MY GOALS WITH FORSAGE?',msg:[{content:'It is based on building a partner network. You tell potential partners about the platform’s potential and encourage them to collaborate with you. Partners who use your link send their first transactions to the smart contract address, and these are then instantly redirected to your wallet. The platform works directly with two marketing plans. Read more about the marketing plans in this video.'}],showContent:false},
                    {title:'IS PASSIVE INCOME POSSIBLE?',msg:[{content:'The platforms Forsage x4, Forsage xGold are designed in such a way that all participants in the system help each other. Passive income is possible, it depends on the activity of partners who can get into your sites through overflows or overtaking.You can receive spillovers from upstream or downstream partners, but your income will depend on their activity. To provide yourself with passive income in the future, you need to make certain efforts - to attract new partners and open new platforms in x3, x4 and xGold.By inviting even one very active person to your team, you can already earn money and achieve your goals. How quickly this happens is up to you.'}],showContent:false},
                    {title:'HOW CAN I ATTRACT PEOPLE EFFECTIVELY? WHAT SHOULD I DO IF I CAN’T ATTRACT ANYONE?',msg:[{content:"You don't have to force participation on anyone.Now many people are interested in making money on the Internet, and some are looking for new opportunities themselves. You can find them on social networks on your own, or set up an automatic sales funnel and interested people will find you themselves. More about this in the 'Academy'section.Use your strengths, watch webinars, ask questions to experienced platform members and improve your skills through free schooling and success will not keep you waiting. Your result depends only on you!Use guide"}],showContent:false},
                    {title:'HOW MUCH CAN I EARN?',msg:[{content:'The amount of income depends on the quality indicators of your activity and the activity of your partners. An example of such activity can be see the link.On website you can see the current information of partners. See for yourself that your earnings depend on the activity of partners, and not on their number.What do we see? First, there is a simple dependence - the more partners, the more money collected: 962 partners have raised over 700 thousand US dollars. Soon ID 8679 will be a dollar millionaire!But with the second and third examples, the dependence is inverse - the third has almost a hundred times (!) Fewer partners and, at the same time, one and a half times more funds were received: 142 thousand versus 93 thousand.This allows us to conclude that the activity of partners is more important their quantity.You can find out how to attract effective partners at Forsage Academy courses!'}],showContent:false},
                    {title:'DO I NEED TO WITHDRAW MONEY FROM FORSAGE?',msg:[{content:'FORSAGE does not retain any funds, so the balance of the smart contract is equal to zero. You can see this for yourself, by following the LINK. Your income arrives instantly into your personal wallet directly from your partners. Only you have access to your wallet and no one else can manage your money.'}],showContent:false},
                    {title:'WHAT ARE X3, X4 AND XGOLD, AND WHAT ARE LEVELS?',msg:[{content:'The x3, x4 and xGold programs are matrices with a limited number of places. There are three places in the x3 matrix, six in the x4 matrix, and thirty in the xGold matrix. When filling in the matrix, the same new one opens automatically.Each program has 12 levels in Forsage Ethereum and 15 in Forsage Tron. Each level costs exactly 2 times more expensive than the previous one and allows you to earn 2 times more.'}],showContent:false},
                    {title:'DO LEVELS HAVE A VALIDITY PERIOD?',msg:[{content:'Not. You buy any level in the program once and for all. Levels have no expiration dates. This makes the Forsage platform significantly different from other platforms where repeat payments are required from you.'}],showContent:false},
                    {title:'WHAT IS REPEAT (RE-OPENING)?',msg:[{content:'If there are no free places left on a level, then the next partner gets a place in an automatically created matrix of the same level. This is called Repeat. The partner who took the last place pays for the new matrix, and the amount goes to a higher-ranked partner. This process is entirely automated by the smart contract.'}],showContent:false},
                    {title:'WHAT ARE "OVERFLOWS" AND "OVERTAKES"?',msg:[{content:'Overflows are when vacant places in your sites are filled with partners who were not invited by you. They can come from both an upstream partner and a downstream partner.Overtaking is a situation when your partner does not have a level that his partner activates and the transaction is sent along the chain to you, provided that you have this level active. This partner follows you and brings you income until his superior partner activates the missing levels.'}],showContent:false},
                    {title:'CAN I LOSE PARTNER WHOM I HAVE PERSONALLY INVITED?',msg:[{content:'No. This is out of the question. Your personally invited partner stays with you forever thanks to the referral link.'}],showContent:false},
                    {title:'WHY AM I SEEING A PARTNER IN X4, BUT NOTHING IS COMING INTO MY WALLET?',msg:[{content:'This can happen in two cases:- your partner got to you in the first line of the x4 matrix and your superior partner received the transaction, and your income is formed by the partners of the second line. Also, you will receive income from the activity of your partners when filling their first lines in x4;- your partner took the last free space in the x3 or x4 matrix and his transaction paid for your new site. The money went to your upline partner. Also, you will receive income from the Repeat of your partners.'}],showContent:false},
                    {title:'HOW DOES THIS DIFFER FROM A PYRAMID SCHEME?',msg:[{content:"Forsage doesn't give members unfulfilled promises like a pyramid scheme. Everyone's success depends on himself. Forsage is stable even at 1000x scaling. Forsage does not create debt or other obligations.Forsage is a next generation crowdfunding platform and has nothing to do with pyramids. The principle of a pyramid scheme is based on the fact that most of the money is concentrated in the hands of its creators. The earlier you came, the more you earned. The financial pyramid can close at any time. Members of the Forsage platform - both leaders and newcomers - are on an equal footing. Nobody can stop the work of the platform. its functioning is provided by a smart contract, which cannot be deleted or changed. Even if the site stops working, all data and structure will be intact, and the smart contract will continue to function as long as the Internet and electricity exist."}],showContent:false},
                    {title:'WHAT ARE THE RISKS?',msg:[{content:'There are no risks of the Forsage platform. It is enough to invite 1 person to immediately recoup the initial participation costs. The platform operates on the basis of a smart contract in the blockchain system. The smart contract code is publicly available.All transfers go directly to your personal wallet, without any hidden fees and without the use of third-party resources. This ensures that any amount you earn belongs to you and only you, and you can use the money in any way you want in the very second it entered your wallet.'}],showContent:false},
                ]
			};
		},
		onShow() {


		},
		onReady() {

		},
		onLoad(option) {
			if (option.src) this.src = option.src;


		},

		computed: {
			...mapState(["defaultWallet"]),
			...mapGetters(["hasDefaultWallet"])
		},
		components: {
			CustomBar,
            NoDefaultWallet,
            // uniCollapse
            // ,uniCollapseItem
		},
         methods:{
            changeContent(index){                       //通过index拿到当前值
                this.list[index].showContent=!this.list[index].showContent;
            },
            changeContentInfo(index,indexMsg){
                console.log(index,indexMsg)
            },
        }
	};
</script>

<style scoped lang="scss">
	.forsageFAQ {
		width: 750rpx;

		.FAQTop {
            position: relative;
			width: 740rpx;
			// margin-bottom: 45rpx;
			image {
				width: 100%;
			    height: 379rpx;
            }
            .FAQTopTitle {
				width: 750rpx;
				margin: 0 auto;
                text-align: center;
                position: absolute;
                top: 248rpx;
				.titleTop {
					margin: 0 auto;
					.titleTopText {
                        margin: 0 auto;
                       image{
                           width: 89rpx;
                        height: 43rpx;
                       }
					}
					.titleTopBorder {
                        margin: 0 auto;
                        margin-top: -17rpx;
						width: 196rpx;
                        height: 14rpx;
                        background: #3D4055;
                        border-radius: 5rpx;
						margin-bottom: 21rpx;
					}

				}
				.titlebottom {
					.titlebottomText {
                        height: 29rpx;
                        font-size: 30rpx;
                        font-family: PingFang SC;
                        font-weight: 400;
                        color: #F3CF9E;
                        line-height: 30rpx;
                        padding-bottom: 28rpx;
					}
				}
            }
        }
        .FAQList{
            padding-bottom: 100rpx;
            .fold-list{
                margin: 0 auto;
                width: 690rpx;
                min-height: 110rpx;
                background: linear-gradient(90deg, #303145, #44495E);
                box-shadow: 0rpx 11rpx 62rpx 0rpx rgba(21, 21, 34, 0.67);
                border-radius: 30rpx;
                margin-bottom: 44rpx;
                .fold-listItem{
                    width: 100%;
                    min-height: 110rpx;
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    .fold-listItemLeft{
                        margin-left: 24rpx;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        position: relative;
                            .question{
                                position: absolute;
                                top:0rpx;
                                left: 2rpx;
                                font-size: 26rpx;
                                font-family: eryakuheiti;
                                font-weight: 700;
                                color: #8D5A0B;
                                line-height: 36rpx;
                            }
                        image{
                            width: 59rpx;
                            height: 35rpx;
                            
                        }
                    }
                    .fold-listItemRight{
                        margin-right: 32rpx;
                        image{
                            width: 32rpx;
                            height: 19rpx;
                        }
                    }
                }
                .fold-title{
                    width: 480rpx;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow:ellipsis;
                // height: 29rpx;
                font-size: 30rpx;
                font-family: PingFang SC;
                font-weight: bold;
                color: #F3E4CF;
                line-height: 30rpx;
                margin-left: 20rpx;
                }
                .fold-content{
                    margin: 0 auto;
                    width: 644rpx;
                    // height: 109rpx;
                    font-size: 26rpx;
                    font-family: PingFang SC;
                    font-weight: 400;
                    color: #F3E4CF;
                    line-height: 44rpx;
                    padding-bottom: 40rpx;
                }
            }
        }
        
    }
</style>
