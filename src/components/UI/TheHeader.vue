<template>
  <header class="header">
    <div class="logo">
      <div class="svg-center">
        <!-- <svg width="50" height="50" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round"
          stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m21 4c0-.478-.379-1-1-1h-16c-.62 0-1 .519-1 1v16c0 .621.52 1 1 1h16c.478 0 1-.379 1-1zm-16.5.5h15v15h-15zm13.5 10.75c0-.414-.336-.75-.75-.75h-4.5c-.414 0-.75.336-.75.75s.336.75.75.75h4.5c.414 0 .75-.336.75-.75zm-11.772-.537 1.25 1.114c.13.116.293.173.455.173.185 0 .37-.075.504-.222l2.116-2.313c.12-.131.179-.296.179-.459 0-.375-.303-.682-.684-.682-.185 0-.368.074-.504.221l-1.66 1.815-.746-.665c-.131-.116-.293-.173-.455-.173-.379 0-.683.307-.683.682 0 .188.077.374.228.509zm11.772-2.711c0-.414-.336-.75-.75-.75h-4.5c-.414 0-.75.336-.75.75s.336.75.75.75h4.5c.414 0 .75-.336.75-.75zm-11.772-1.613 1.25 1.114c.13.116.293.173.455.173.185 0 .37-.074.504-.221l2.116-2.313c.12-.131.179-.296.179-.46 0-.374-.303-.682-.684-.682-.185 0-.368.074-.504.221l-1.66 1.815-.746-.664c-.131-.116-.293-.173-.455-.173-.379 0-.683.306-.683.682 0 .187.077.374.228.509zm11.772-1.639c0-.414-.336-.75-.75-.75h-4.5c-.414 0-.75.336-.75.75s.336.75.75.75h4.5c.414 0 .75-.336.75-.75z" />
        </svg> -->
        <!-- IHU LOGO SVG -->
        <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="50" height="50" version="1.1" style="
            shape-rendering: geometricPrecision;
            text-rendering: geometricPrecision;
            image-rendering: optimizeQuality;
            fill-rule: evenodd;
            clip-rule: evenodd;
          " viewBox="0 0 31970 31970" xmlns:xlink="http://www.w3.org/1999/xlink">
          <g id="Layer_x0020_1">
            <metadata id="CorelCorpID_0Corel-Layer" />
            <path class="fil0"
              d="M15990 31970c8820,0 15980,-7160 15980,-15980 0,-8830 -7160,-15990 -15980,-15990 -8830,0 -15990,7160 -15990,15990 0,8820 7160,15980 15990,15980z" />
            <polygon class="fil1"
              points="15490,15810 3290,15810 3350,16110 3490,16550 3630,16990 3780,17410 3910,17810 4060,18190 4190,18530 4340,18840 4480,19120 4620,19350 4770,19540 4910,19690 5050,19790 5190,19820 5340,19820 5470,19750 5620,19640 5750,19480 5900,19250 6040,18990 6180,18680 6330,18310 6470,17900 6610,17460 6750,16980 6900,16470 7030,15930 7180,15360 7320,14790 7460,14190 7610,13590 7740,12990 7890,12390 8030,11800 8170,11240 8310,10690 8460,10160 8590,9680 8740,9220 8890,8810 9020,8460 9170,8140 9300,7880 9450,7680 9590,7550 9730,7470 9870,7450 10020,7500 10160,7630 10300,7810 10450,8060 10580,8380 10730,8760 10870,9200 11010,9700 11150,10260 11290,10870 11440,11530 11580,12230 11720,12970 11860,13740 12010,14540 12140,15370 12290,16220 12430,17070 12570,17920 12710,18790 12850,19640 13000,20490 13140,21310 13280,22100 13420,22880 13570,23610 13700,24310 13850,24970 13990,25580 14130,26140 14280,26650 14420,27090 14560,27490 14700,27820 14840,28100 14980,28310 15130,28470 15260,28560 15390,28610 15490,28620 " />
            <polygon class="fil2"
              points="14760,13010 14770,4390 19190,4390 19290,22930 22110,22930 22110,11850 26220,11850 26260,15110 28810,15100 28810,15850 25530,15860 25490,12600 22860,12600 22860,23680 18550,23680 18450,5140 15510,5140 15510,13010 " />
            <path class="fil1"
              d="M15130 11890c620,0 1120,500 1120,1120 0,610 -500,1110 -1120,1110 -610,0 -1110,-500 -1110,-1110 0,-620 500,-1120 1110,-1120z" />
            <path class="fil1"
              d="M28810 14360c620,0 1120,500 1120,1120 0,610 -500,1110 -1120,1110 -610,0 -1110,-500 -1110,-1110 0,-620 500,-1120 1110,-1120z" />
          </g>
        </svg>
        <!-- IHU LOGO SVG END -->
      </div>
      <router-link to="/">{{ title }}</router-link>
    </div>
    <div class="mobile-logo">
      <div class="burger-button" @click="closeHamburgerFn()">
        <svg v-if="!hamburgerClose" width="50" height="50" clip-rule="evenodd" fill-rule="evenodd"
          stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m22 16.75c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75z"
            fill-rule="nonzero" />
        </svg>

        <!-- X-MARKS-THE-SPOT-CLOSE-MENU -->
        <svg v-if="hamburgerClose" width="50" height="50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
          <path class="fill-xmark"
            d="M312.1 375c9.369 9.369 9.369 24.57 0 33.94s-24.57 9.369-33.94 0L160 289.9l-119 119c-9.369 9.369-24.57 9.369-33.94 0s-9.369-24.57 0-33.94L126.1 256L7.027 136.1c-9.369-9.369-9.369-24.57 0-33.94s24.57-9.369 33.94 0L160 222.1l119-119c9.369-9.369 24.57-9.369 33.94 0s9.369 24.57 0 33.94L193.9 256L312.1 375z" />
        </svg>
        <!-- X-MARKS-THE-SPOT-CLOSE-MENU -->
      </div>
      <router-link to="/">{{ title }}</router-link>
      <!-- IHU LOGO SVG -->
      <svg xmlns="http://www.w3.org/2000/svg" xml:space="preserve" width="50" height="40" version="1.1" style="
          shape-rendering: geometricPrecision;
          text-rendering: geometricPrecision;
          image-rendering: optimizeQuality;
          fill-rule: evenodd;
          clip-rule: evenodd;
        " viewBox="0 0 31970 31970" xmlns:xlink="http://www.w3.org/1999/xlink">
        <g id="Layer_x0020_1">
          <metadata id="CorelCorpID_0Corel-Layer" />
          <path class="fil0"
            d="M15990 31970c8820,0 15980,-7160 15980,-15980 0,-8830 -7160,-15990 -15980,-15990 -8830,0 -15990,7160 -15990,15990 0,8820 7160,15980 15990,15980z" />
          <polygon class="fil1"
            points="15490,15810 3290,15810 3350,16110 3490,16550 3630,16990 3780,17410 3910,17810 4060,18190 4190,18530 4340,18840 4480,19120 4620,19350 4770,19540 4910,19690 5050,19790 5190,19820 5340,19820 5470,19750 5620,19640 5750,19480 5900,19250 6040,18990 6180,18680 6330,18310 6470,17900 6610,17460 6750,16980 6900,16470 7030,15930 7180,15360 7320,14790 7460,14190 7610,13590 7740,12990 7890,12390 8030,11800 8170,11240 8310,10690 8460,10160 8590,9680 8740,9220 8890,8810 9020,8460 9170,8140 9300,7880 9450,7680 9590,7550 9730,7470 9870,7450 10020,7500 10160,7630 10300,7810 10450,8060 10580,8380 10730,8760 10870,9200 11010,9700 11150,10260 11290,10870 11440,11530 11580,12230 11720,12970 11860,13740 12010,14540 12140,15370 12290,16220 12430,17070 12570,17920 12710,18790 12850,19640 13000,20490 13140,21310 13280,22100 13420,22880 13570,23610 13700,24310 13850,24970 13990,25580 14130,26140 14280,26650 14420,27090 14560,27490 14700,27820 14840,28100 14980,28310 15130,28470 15260,28560 15390,28610 15490,28620 " />
          <polygon class="fil2"
            points="14760,13010 14770,4390 19190,4390 19290,22930 22110,22930 22110,11850 26220,11850 26260,15110 28810,15100 28810,15850 25530,15860 25490,12600 22860,12600 22860,23680 18550,23680 18450,5140 15510,5140 15510,13010 " />
          <path class="fil1"
            d="M15130 11890c620,0 1120,500 1120,1120 0,610 -500,1110 -1120,1110 -610,0 -1110,-500 -1110,-1110 0,-620 500,-1120 1110,-1120z" />
          <path class="fil1"
            d="M28810 14360c620,0 1120,500 1120,1120 0,610 -500,1110 -1120,1110 -610,0 -1110,-500 -1110,-1110 0,-620 500,-1120 1110,-1120z" />
        </g>
      </svg>
      <!-- IHU LOGO SVG END -->

    </div>

    <div style="width: 100%">
      <div class="main-nav" v-if="hamburgerClose">
        <ul>
          <li v-if="isLoggedIn" @click="closeHamburgerFn()" class="nav__item">
            <router-link :to="{ name: 'labList' }">Εργαστήρια</router-link>
          </li>
          <li v-if="isLoggedIn" @click="closeHamburgerFn()" class="nav__item">
            <router-link :to="{ name: 'submittedLabs' }">Δηλωθέντα</router-link>
          </li>
          <li v-if="isLoggedIn && IsStaff" @click="closeHamburgerFn()" class="nav__item">
            <router-link :to="{ name: 'addlab' }">Προσθήκη</router-link>
          </li>
          <li v-if="isLoggedIn" @click="closeHamburgerFn()" class="nav__item">
            <router-link to="/">Επικοινωνία</router-link>
          </li>
        </ul>
        <div class="menu-divider"></div>
        <div class="button-groupper">
          <div class="nav__item--cta" v-if="!isLoggedIn">
            <v-btn @click="redirectToLogin" class="sign-btn" rounded="pill" variant="outlined">
              ΣΥΝΔΕΣΗ
            </v-btn>
          </div>

          <div class="nav__item--cta" v-if="isLoggedIn">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z" />
            </svg>
            <router-link style="text-transform: capitalize;" to="/">{{ userName }}</router-link>
          </div>
          <div style="cursor: pointer" class="logout-btn svg-center" v-if="isLoggedIn" @click="logOut">
            <!-- ΑΠΟΣΥΝΔΕΣΗ -->

            <v-tooltip text="Αποσύνδεση" location="bottom">
              <template v-slot:activator="{ props }">
                <svg v-bind="props" fill="#000000" height="30" width="30" version="1.1" id="XMLID_173_"
                  xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 26"
                  xml:space="preserve">
                  <g id="logout">
                    <g>
                      <path
                        d="M15,24H0V2h15v8h-2V4H2v18h11v-6h2V24z M18.4,18.7L17,17.3l3.3-3.3H5v-2h15.3L17,8.7l1.4-1.4L24,13L18.4,18.7z" />
                    </g>
                  </g>
                </svg>
              </template>
            </v-tooltip>
          </div>
        </div>
      </div>
    </div>
  </header>

  <!-- <slot name="content" @closeMobileView="closeHamburgerFn(true)">
    <h1>you shouldn't be seeing this</h1>
  </slot> -->
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, watch, computed, toRefs } from "vue";
import { useWindowSize } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth.composable";
import { useStore } from "vuex";
import { key } from "@/store/index";
export default defineComponent({
  props: {
    closeInstantlyDirective: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  setup(props) {
    let hamburgerClose = ref(false);
    const { width } = useWindowSize();
    const { closeInstantlyDirective } = toRefs(props);
    let title = "IHU SUBMISSIONS";
    const store = useStore(key);
    const router = useRouter();
    const { GetUserDataDetails, SetNotAuthenticated, IsTeacher } = useAuth();
    const isLoggedIn = computed((): boolean => {
      return store.getters.IsAuth;
    });
    const userName = computed(() => {
      if (isLoggedIn.value === true)
        return GetUserDataDetails()?.DisplayNameEl ?? "User";
      SetNotAuthenticated();
      return "";
    });
    const IsStaff = computed(() => {
      if (isLoggedIn.value) {
        return IsTeacher();
      }
      return false;
    });

    onMounted(() => {
      if (window.innerWidth < 769) {
        hamburgerClose.value = false;
      } else {
        hamburgerClose.value = true;
      }
    });

    watch(width, () => {
      if (width.value >= 769) {
        hamburgerClose.value = true;
        return;
      }
      hamburgerClose.value = false;
      return;
    });

    watch(closeInstantlyDirective, async () => {
      if (
        width.value < 769 &&
        closeInstantlyDirective.value &&
        hamburgerClose.value
      ) {
        closeHamburgerFn();
      }
    });

    const closeHamburgerFn = async () => {
      if (window.innerWidth < 769) {
        if (closeInstantlyDirective.value) {
          hamburgerClose.value = false;
        } else {
          hamburgerClose.value = !hamburgerClose.value;
        }
        return;
      }
      hamburgerClose.value = true;
    };
    const redirectToLogin = () => {
      router.replace({ name: "sign-in" });
    };

    const logOut = async () => {
      await SetNotAuthenticated();
      router.replace({ name: "welcome" });
    };
    const delay = async (time: number) => {
      return new Promise((resolve) => setTimeout(resolve, time));
    };

    return {
      title,
      redirectToLogin,
      hamburgerClose,
      closeHamburgerFn,
      isLoggedIn,
      userName,
      IsStaff,
      logOut,
    };
  },
});
</script>

<style scoped>
.fil1 {
  fill: #fefefe;
}

.fil0 {
  fill: #284168;
}

.fil2 {
  fill: #fefefe;
  fill-rule: nonzero;
}

.fill-xmark {
  fill: #585858;
}

.burger-button {
  display: flex;
  justify-content: center;
  align-items: center;
}

.header {
  /* border: 1px solid #a2a2a2; */
  background-color: #dae3f7;
  -webkit-box-shadow: 0px 0px 14px 0px rgb(0 0 0 / 75%);
  -moz-box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 14px 0px rgb(0 0 0 / 75%);
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  border-radius: 5px;
  min-width: 320px;
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 1000;
}

ul {
  margin: 0;
  padding: 0;
  list-style: none;
  font-weight: 450;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.6rem;
  width: 100%;
}

.logo {
  display: none;
}

.main-nav {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  height: 100%;
}

/* .main-nav a {
  text-transform: uppercase;
} */

a {
  text-decoration: none;
  display: inline-block;
  position: relative;
  color: #0a369d;
}

a:hover {
  /* color: white; */
}

/* a:hover::after {
  transform: scaleX(1);
  transform-origin: bottom left;
}

a::after {
  content: "";
  position: absolute;
  width: 100%;
  transform: scaleX(0);
  height: 3px;
  bottom: -1rem;
  left: 0;
  background-color: #0a369d;
  transform-origin: bottom right;
  transition: transform 0.25s ease-out;
} */

.mobile-logo {
  display: flex;
  flex-direction: row;
  gap: 1rem;
  justify-content: space-between;
  align-items: center;
  margin: 0.5rem 1rem;
}

.mobile-logo--logo {
  order: 1;
}

.mobile-logo a {
  font-size: large;
  text-transform: uppercase;
  font-weight: 600;
}

.nav__item--cta {
  display: flex;
  flex-direction: row;
  justify-content: center;
  gap: 0.3rem;
  align-items: center;
  font-weight: 450;
  margin-bottom: 0.5rem;
}

.sign-btn:hover {
  border-color: white;
  color: white;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
}

.button-groupper {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 0.3rem;
}

.logout-btn {
  padding: 0;
  width: fit-content;
}

@media (min-width: 769px) {
  a:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }

  a::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 3px;
    bottom: -0.3rem;
    left: 0;
    background-color: #0a369d;
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 0 auto;
    min-width: 769px;
    position: sticky;
    z-index: 100;
    top: 0px;
    left: 0px;
  }

  .logo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    max-width: 1025px;
    font-weight: 600;
    font-size: x-large;
    text-transform: uppercase;
  }

  .main-nav {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    width: 100%;
    gap: 0;
    height: 3.5rem;
    margin: 0;
  }

  .main-nav button {
    padding: 0.5rem;
  }

  ul {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    max-width: 1025px;
    /* font-weight: 600; */
    width: fit-content;
  }

  .nav__item {
    margin: 0 1rem;
    padding: 0;
  }

  .nav__item--cta {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: center;
    font-weight: 450;
    margin: 0;
  }

  .mobile-logo {
    display: none;
  }

  .svg-center {
    display: flex;
    align-items: center;
    margin: 0.5rem 0.5rem;
  }

  .button-groupper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
  }
}

@media (min-width: 1025px) {
  .menu-divider {
    margin: 0 0.3rem;
    opacity: 0.1;
    border: 0.1px solid rgb(0, 0, 0);
    width: 0.1px;
    height: 6rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  a:hover::after {
    transform: scaleX(1);
    transform-origin: bottom left;
  }

  a::after {
    content: "";
    position: absolute;
    width: 100%;
    transform: scaleX(0);
    height: 3px;
    bottom: -0.3rem;
    left: 0;
    background-color: #0a369d;
    transform-origin: bottom right;
    transition: transform 0.25s ease-out;
  }

  .header {
    display: flex;
    width: 100%;
    height: 6rem;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    min-width: 1025px;
    gap: 0.5rem;
  }

  .logo {
    width: 40%;
    height: inherit;
    display: flex;
    flex-direction: row;
    justify-content: flex-start;
    align-items: center;
    max-width: 1160px;
    font-weight: 600;
    font-size: 1.3965rem;
    text-transform: uppercase;
  }

  .logo a {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    margin: 0 1rem;
  }

  .main-nav {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    height: inherit;
  }

  ul {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    font-weight: 450;
    max-width: 1160px;
    width: fit-content;
    gap: 0;
  }

  .nav__item {
    margin: 0 1rem;
    padding: 0;
  }

  .nav__item--cta {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: 0.5rem;
    align-items: center;
    font-weight: 450;
  }

  .mobile-logo {
    display: none;
  }

  .button-groupper {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    margin: 0;
    width: fit-content;
    gap: 0.5rem;
    margin: 0 0.5rem;
  }
}
</style>
