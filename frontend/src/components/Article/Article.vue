<template>
  <div
    class="row items-center article full-width"
    @click="onOpenArticle"
    :class="editingMode ? 'justify-start' : 'justify-around'"
  >
    <div class="article__img" :class="editingMode ? 'mr-md' : ''">
      <img :src="article.og.images[0].url" alt="Image de l'article" class="br-sm" />
    </div>
    <div class="column items-start article__text" :style="editingMode ? 'width : 60%' : 'width : 65%'">
      <span class="font-14 text-main article__text--title mb-xs">{{ article.og.title }}</span>
      <span class="font-12 text-caption article__text--description">{{ article.og.description }}</span>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'ArticlePreview',
  props: {
    article: { type: Object, required: true },
    editingMode: { type: Boolean, default: false },
  },
  setup(props) {
    const onOpenArticle = () => {
      window.open(props.article.og.url, '_blank');
    };

    return { onOpenArticle };
  },
});
</script>

<style lang="scss" scoped>
.article {
  cursor: pointer;
  &__img {
    width: 30%;
    & img {
      width: 100%;
    }
  }
  &__text {
    width: 60%;
    & > * {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
  &:hover {
    & .article__text--title {
      text-decoration: underline;
    }
  }
}
</style>
