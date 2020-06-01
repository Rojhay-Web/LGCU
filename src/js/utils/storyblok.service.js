import { Component } from 'react';
import StoryblokClient from 'storyblok-js-client';

class StoryblokService extends Component {
    constructor() {
        super();

        this.devMode = true; // Always loads draft
        this.token = 'LjjiG8j7Y4br9LrBCoGAhwtt'
        this.client = new StoryblokClient({
            accessToken: this.token,
            cache: {
                clear: 'auto',
                type: 'memory'
            }
        })

        this.query = {}
    }

    getCacheVersion() {
        return this.client.cacheVersion
    }

    get(slug, params) {
        var localparams = params || {};

        if (this.getQuery('_storyblok') || this.devMode || (typeof window !== 'undefined' && window.storyblok)) {
            localparams.version = 'draft'
        }

        if (typeof window !== 'undefined' && typeof window.StoryblokCacheVersion !== 'undefined') {
            localparams.cv = window.StoryblokCacheVersion
        }

        return this.client.get(slug, params)
    }

    initEditor(reactComponent) {
        if (window.storyblok) {
            window.storyblok.init()
            window.storyblok.on(['change', 'published'], () => window.location.reload(true))

            window.storyblok.on('input', (event) => {
                if (event.story.content && reactComponent && reactComponent.state.pageContent && event.story.content._uid === reactComponent.state.pageContent._uid) {
                    reactComponent.setState({ pageContent: window.storyblok.addComments(event.story.content, event.story.id) })
                }
            })
        }
    }

    setQuery(query) {
        this.query = query
    }

    getQuery(param) {
        return this.query[param]
    }

    getContentType(type, page){
        var ret = null;
        try {
            if(page) {
                var body = page.data.story.content.body;

                if(body && body.length > 0){
                    ret = body.filter(function(item) { return item.component.toLowerCase() === type.toLowerCase(); });
                }
            }
        }
        catch(ex){
            console.log("Error Returning Content Type: ",ex);
        }
        return (ret != null && ret.length > 0 ? ret[0] : null);
    }

    async getInitialProps({ query }, pageUrl, callback) {
        this.setQuery(query);

        let [page] = await Promise.all([
            this.get(pageUrl)
        ]);

        callback(page);
    }
}


export default StoryblokService;
