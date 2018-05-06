<template>
  <div class="container">
    <div class="droplist shop-goods">
      <h3>菜单列表</h3>
      <div :data-goodid="good.gid" class="shop-good" v-for="(good) in goods" v-bind:key="good.id">
        {{good.id}}
      </div>
    </div>

    <div ref="cart" class="sortlist shop-cart">
      <h3>购物车</h3>
      {{myGoods}}
      <div class="shop-good" 
        v-for="(good) in myGoods" :key="good.t.gid"
        v-if="good && good.data && good.data.length > 0">
          {{good.t.gid}} {{good.data && good.data.length}}
          <button @click="removeMyGood(good.t.gid)">-</button>
      </div>
    </div>
  </div>
</template>

<script>
import { Sortable, Draggable  } from '@shopify/draggable';

  //  shopGoodsdraggable.on('sortable:sort', (evt) => {     
  //     // console.log(evt.data.dragEvent.data.originalSource);      
  //   });
    
  //   shopGoodsdraggable.on('sortable:sorted', (evt) => {
  //     // console.log(evt.data.dragEvent.data.originalSource.dataset.goodid);         
  //     if (ret.onSelected) {
  //       ret.onSelected(evt.data.dragEvent.data.originalSource.dataset.goodid, evt);
  //     }  
  //   });

function cartListModule(options = {})  {
  let containerSelector = ".sortlist";
  const sortable = new Sortable(document.querySelectorAll(containerSelector), {
    draggable: '.shop-good',
    mirror: {
      constrainDimensions: true,
    },
  });

  const containerTwoCapacity = 3;
  const containerTwoParent = sortable.containers[0].parentNode;
  let lastOverContainer;
  let capacityReached;
  let currentMediumChildren;

  sortable.on('drag:start', (evt) => {
    console.log(sortable.getDraggableElementsForContainer(sortable.containers[0]));
    currentMediumChildren = sortable.getDraggableElementsForContainer(sortable.containers[0]).length;
    capacityReached = currentMediumChildren === containerTwoCapacity;
    lastOverContainer = evt.sourceContainer;
    // containerTwoParent.classList.toggle(Classes.capacity, capacityReached);
  });

  sortable.on('sortable:sort', (evt) => {     
    // console.log(evt.data.dragEvent.data.originalSource);      
    evt.cancel();
  });
  
  sortable.on('sortable:sorted', (evt) => {
    console.log(evt.data.dragEvent.data.originalSource.dataset.goodid);         
    // if (ret.onSorted) {
    //   ret.onSorted(evt.data.dragEvent.data.originalSource.dataset.goodid, evt);
    // }  
  });

  var ret = {
    origin: sortable
  };

  return ret;
}

function selectGoodModule(options = {}) {
  let containerSelector = ".droplist";
  const container = new Draggable(document.querySelectorAll(containerSelector), {
    draggable: '.shop-good',
    mirror: {
      constrainDimensions: true,
    },
  });

  let lastOverContainer;

  container.on('drag:start', (evt) => {    
    lastOverContainer = null;       
  });

  container.on('drag:move', (evt) => {       
    if (evt.data.sensorEvent) {
      lastOverContainer = evt.data.sensorEvent.data.target;
    }   
  });

  container.on('drag:stop', (evt) => {    
    if (!options.overContainer) {
      return;
    }   
    if ( lastOverContainer === options.overContainer
      || options.overContainer.contains(lastOverContainer)
    ) {
      if (ret.onSelected) {
        ret.onSelected(evt.data.originalSource.dataset.goodid, evt);
      }  
    } else {
      evt.cancel();
    }
  });

  var ret = {
    origin: container
  };

  return ret;
}

class ShopCartGoods {
  constructor() {
    this.v = {};
  }
  set(id, v) {
    if (!this.v[id]) {
      this.v[id] = {
        t: v,
        data: [v],
        u: Date.now()
      };
    } else {
      this.v[id].data.push(v);
      this.v[id].u = Date.now();
    }
  }
  decrement(id) {
    if (!this.v[id]) {
    } else {
      if (!this.v[id].data) {
        // error
      } else {
        console.log(id);
        this.v[id].data.pop();
        if (this.v[id].data.length === 0) {

        }
      }
    }
  }
  get(id) {
     if (!this.v[id]) {
       return null;
     } else {
       return this.v[id];
     }
  }
  valueOf() {
    return this.v;
  } 
}

let shopCartGoods = new ShopCartGoods();

class ArrayUtils {
  constructor(vm = null) {
    this.vm = vm;
  }
  set(arr, whereFind, howtochange) {
    if (!this.vm) {
      return false;
    }

    let findIndex = arr.findIndex(whereFind);
    if (!Array.isArray(arr)) {
      return false;
    }

    if (findIndex < 0) {
      return false;
    }

    this.vm.$set(arr, findIndex, howtochange(findIndex));

    howtochange(findIndex);
    return true;
  }
};

let goodMixin = {
  data () {
    return {
      goods: [
        {
          id: 1,
          gid: 1
        },
        {
          id: 2,
          gid: 2
        },
        {
          id: 3,
          gid: 3
        }
      ],
      myGoods: []
    }
  },
  methods: {
    removeMyGood(gid) {
      let self = this;
      shopCartGoods.decrement(gid);
      self.$auiSet(self.myGoods, (ele, index) => {
        return ele.gid === gid;
      }, function(findIndex) {
        return shopCartGoods.get(gid);
      })
    }
  },
  mounted() {
    let self = this;
    let sortgoods = selectGoodModule({
      overContainer: self.$refs.cart
    });
    sortgoods.onSelected = function(gid, evt) {
      let good = self.goods.find((good, index) => { return good.gid === parseInt(gid) });
      
      if (!good) {
        // error
      }
      shopCartGoods.set(gid, good);
      self.$auiBefore(self.myGoods, (ele,index) => {
        console.log(ele.t.gid, gid);
        return ele.t.gid === parseInt(gid)
      }, function() {
        return shopCartGoods.get(gid)
      });

      console.log(self.myGoods);
    };
    // let cartlist = cartListModule(); 
  }
}

export default {
  mixins: [goodMixin]
}
</script>

<style lang="scss" scoped>
  .container {
    display: flex;    
    justify-content: space-around;
  }

  .shop-goods {
    width: 40vw;
    overflow: hidden;
    border: 1px solid #000;
    padding: 1vw;
  }

  .shop-cart {
    width: 40vw;
    background-color: rgb(172, 255, 237);
    border: 1px solid #000;
    padding: 1vw;
  }

  .shop-good {
    width: 10vw;
    height: 10vw;
    float: left;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 3vw;
    border: 1px solid #000;
    user-select: none;
  }

  .shop-good + .shop-good {
    margin-left: 1vw;
  }
</style>
