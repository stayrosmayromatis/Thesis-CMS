<template>
  <header class="header">
    <div class="logo">
      <div class="svg-center">
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
      <!-- <router-link  to="">{{ title }}</router-link> -->
      <span class="span__header">{{ title }}</span>
    </div>
    <div class="mobile-logo">
      <div class="burger-button" @click="closeHamburgerFn()">
        <svg v-if="!hamburgerClose" width="30" height="30" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round"
          stroke-miterlimit="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path
            d="m22 16.75c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75zm0-5c0-.414-.336-.75-.75-.75h-18.5c-.414 0-.75.336-.75.75s.336.75.75.75h18.5c.414 0 .75-.336.75-.75z"
            fill-rule="nonzero" />
        </svg>

        <!-- X-MARKS-THE-SPOT-CLOSE-MENU -->
        <svg v-if="hamburgerClose" width="30" height="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
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
    <div class="main-nav" v-if="hamburgerClose">
      <ul>
        <li v-if="isLoggedIn && IsPeriodActive" @click="closeHamburgerFn()" class="nav__item">
          <router-link :to="{ name: 'labList' }"
            exact-active-class="router-link-exact-active-mark">Εργαστήρια</router-link>
        </li>
        <li v-if="isLoggedIn" @click="closeHamburgerFn()" class="nav__item">
          <router-link :to="{ name: 'submittedLabs' }"
            exact-active-class="router-link-exact-active-mark">Δηλωθέντα</router-link>
        </li>
        <li v-if="isLoggedIn && IsStaff && !IsPeriodActive" @click="closeHamburgerFn()" class="nav__item">
          <router-link :to="{ name: 'addlab' }" exact-active-class="router-link-exact-active-mark">Προσθήκη</router-link>
        </li>
        <li v-if="isLoggedIn && IsStaff" @click="closeHamburgerFn()" class="nav__item">
          <router-link :to="{ name: 'admin' }" exact-active-class="router-link-exact-active-mark">Διαχείριση</router-link>
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
          <!-- <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z" />
            </svg> -->
          <!-- <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><circle cx="12" cy="8" r="2.1" fill="currentColor" opacity=".3"/><path fill="currentColor" d="M12 14.9c-2.97 0-6.1 1.46-6.1 2.1v1.1h12.2V17c0-.64-3.13-2.1-6.1-2.1z" opacity=".3"/><path fill="currentColor" d="M12 13c-2.67 0-8 1.34-8 4v3h16v-3c0-2.66-5.33-4-8-4zm6.1 5.1H5.9V17c0-.64 3.13-2.1 6.1-2.1s6.1 1.46 6.1 2.1v1.1zM12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4s-4 1.79-4 4s1.79 4 4 4zm0-6.1a2.1 2.1 0 1 1 0 4.2a2.1 2.1 0 0 1 0-4.2z"/></svg> -->
          <!-- LOGGED IN USER ICON SVG -->
          <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
            <path fill="currentColor"
              d="M5.85 17.1q1.275-.975 2.85-1.538T12 15q1.725 0 3.3.563t2.85 1.537q.875-1.025 1.363-2.325T20 12q0-3.325-2.337-5.663T12 4Q8.675 4 6.337 6.337T4 12q0 1.475.488 2.775T5.85 17.1ZM12 13q-1.475 0-2.488-1.012T8.5 9.5q0-1.475 1.012-2.488T12 6q1.475 0 2.488 1.012T15.5 9.5q0 1.475-1.012 2.488T12 13Zm0 9q-2.075 0-3.9-.788t-3.175-2.137q-1.35-1.35-2.137-3.175T2 12q0-2.075.788-3.9t2.137-3.175q1.35-1.35 3.175-2.137T12 2q2.075 0 3.9.788t3.175 2.137q1.35 1.35 2.138 3.175T22 12q0 2.075-.788 3.9t-2.137 3.175q-1.35 1.35-3.175 2.138T12 22Zm0-2q1.325 0 2.5-.388t2.15-1.112q-.975-.725-2.15-1.113T12 17q-1.325 0-2.5.388T7.35 18.5q.975.725 2.15 1.113T12 20Zm0-9q.65 0 1.075-.425T13.5 9.5q0-.65-.425-1.075T12 8q-.65 0-1.075.425T10.5 9.5q0 .65.425 1.075T12 11Zm0-1.5Zm0 9Z" />
          </svg>
          <!-- LOGGED IN USER ICON SVG -->
          <!-- <router-link style="text-transform: capitalize;" to="/">{{ userName }}</router-link> -->
          <label style="text-transform: capitalize;text-decoration: none;
        display: inline-block;
        position: relative;
        color: #0a369d;">{{ userName }}</label>
        </div>
        <div style="cursor: pointer" class="logout-btn svg-center" v-if="isLoggedIn" @click="logOut">
          <!-- ΑΠΟΣΥΝΔΕΣΗ -->

          <v-tooltip text="Αποσύνδεση" location="bottom">
            <template v-slot:activator="{ props }">
              <!-- LOGOUT SVG -->
              <svg v-bind="props" xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24">
                <path fill="currentColor" d="M5 5h7V3H3v18h9v-2H5z" />
                <path fill="currentColor" d="m21 12l-4-4v3H9v2h8v3z" />
              </svg>
              <!-- LOGOUT SVG -->
            </template>
          </v-tooltip>
        </div>
      </div>
    </div>
  </header>
</template>

<script lang="ts">
import { onMounted, defineComponent, ref, computed, toRefs } from "vue";
import { computedEager, useWindowSize } from "@vueuse/core";
import { useRouter } from "vue-router";
import { useAuth } from "@/composables/useAuth.composable";
import { useStore } from "vuex";
import { key } from "@/store/index";
import { usePeriod } from "@/composables/usePeriod.composable";
export default defineComponent({
  props: {
    closeInstantlyDirective: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  setup(props) {
    let hamburgerClose = ref(false);
    const { width } = useWindowSize();
    const { closeInstantlyDirective } = toRefs(props);
    const title = ref(import.meta.env.VITE_APP_TITLE as string);
    const store = useStore(key);
    const router = useRouter();
    const { GetUserDataDetails, SetNotAuthenticated, IsTeacher, IsAuthenticated } = useAuth();
    const { IsPeriodActive, GetPeriodState } = usePeriod();
    const isLoggedIn = computed((): boolean => store.getters.IsAuth);
    const userName = computed(() => {
      if (!isLoggedIn.value)
        return "You are not logged in";
      const userDataDetails = GetUserDataDetails();
      return !userDataDetails || !userDataDetails.DisplayNameEl ? "User" : userDataDetails.DisplayNameEl ?? "User";
    });

    const IsStaff = computed(() => {
      return isLoggedIn.value === true ? IsTeacher() : false;
    });

    //onMounted(async () => {
    // if(await IsAuthenticated() && store.getters.IsFirstTimeLogin){
    //   await GetPeriodState();
    // }
    // });
    // watch(closeInstantlyDirective, async () => {
    //   if (closeInstantlyDirective.value === true) {
    //     closeHamburgerFn();
    //   }
    // });
    computedEager(async () => {
      if (isLoggedIn.value) {
        await GetPeriodState();
        return;
      }
    });
    computedEager(() => {
      if (closeInstantlyDirective.value === true) {
        closeHamburgerFn();
      }
    });
    computedEager(() => {
      hamburgerClose.value = width.value >= 769 ? true : false;
    });

    const closeHamburgerFn = async () => {
      if (width.value >= 769) {
        hamburgerClose.value = true;
        return;
      }
      if (closeInstantlyDirective.value === true) {
        hamburgerClose.value = false;
        return;
      }
      hamburgerClose.value = !hamburgerClose.value;
    };
    const redirectToLogin = async () => {
      await router.replace({ name: "sign-in" });
    };

    const logOut = async () => {
      await router.replace({ name: "welcome" });
      //await SetNotAuthenticated();
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
      IsPeriodActive
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
  background-color: #dae3f7;
  -webkit-box-shadow: 0px 0px 14px 0px rgb(0 0 0 / 75%);
  -moz-box-shadow: 0px 0px 14px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 0px 0px 14px 0px rgb(0 0 0 / 75%);
  position: sticky;
  top: 0px;
  left: 0px;
  z-index: 1000 !important;
  width: 100%;
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
  padding: 0;
  width: 100%;
}

a,
.span__header {
  text-decoration: none;
  display: inline-block;
  position: relative;
  color: #0a369d;
}

a:hover {}

.mobile-logo {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 1rem;
}

.mobile-logo a {
  font-weight: 600;
  font-size: 1rem;
  text-align: center;
  white-space: break-spaces;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
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
  -webkit-box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
    0 8px 10px -6px rgb(0 0 0 / 0.1);
  -moz-box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1),
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

  a:active {
    color: white;
  }

  .router-link-exact-active-mark {
    color: #276EF1;
  }

  .header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    min-width: 769px;
  }

  .logo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    max-width: 1025px;
    font-weight: 600;
    font-size: x-large;
    /* text-transform: uppercase; */
  }

  .main-nav {
    flex-direction: row;
    gap: 0;
    padding: 0.5rem;
  }

  .main-nav button {
    padding: 0.5rem;
  }

  ul {
    flex-direction: row;
    max-width: 1025px;
    font-weight: 600;
    width: fit-content;
  }

  .nav__item {
    margin: 0 1rem;
    padding: 0;
  }

  .nav__item--cta {
    justify-content: space-between;
    gap: 0.5rem;
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
    flex-direction: row;
    gap: 0.5rem;
  }

  .burger-button {
    visibility: hidden;
  }

  .mobile-logo {
    display: none;
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

  .header {
    flex-direction: row;
    justify-content: space-between;
    min-width: 1025px;
    gap: 0.5rem;
  }

  .logo {
    width: 70%;
    justify-content: flex-start;
    max-width: 1160px;
    font-size: 1.3965rem;
  }

  .logo a {
    display: flex;
    justify-content: flex-start;
    align-content: center;
    margin: 0 1rem;
  }

  .main-nav {
    justify-content: flex-end;
    padding: 0;
  }

  ul {
    justify-content: flex-end;
    max-width: 1160px;
    gap: 0;
  }

  .button-groupper {
    margin: 0 0.5rem;
  }
}
</style>
