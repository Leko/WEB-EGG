###
# Page options, layouts, aliases and proxies
###

after_configuration do
  module TagPagesExtension
    def link( tag )
      safe_tag = safe_parameterize(tag)
      safe_tag = URI.encode(tag) if safe_tag == ''
      apply_uri_template @tag_link_template, tag: safe_tag
    end
  end
  Middleman::Blog::TagPages.prepend(TagPagesExtension)

  module MarkdownParserExtension
    def image(link, title, alt_text)
      w, h = FastImage.size(File.join(__dir__, 'source', link))
      "<img data-src=\"#{link}\" alt=\"#{alt_text || title}\" width=\"#{w}\" height=\"#{h}\" style=\"width:#{w}px;height:#{h}px;\" />"
    end
  end
  Middleman::Renderers::MiddlemanRedcarpetHTML.prepend(MarkdownParserExtension)
end

config[:meta] = {
  locale: 'ja',
  locale_long: 'ja_JP',
  sitename: 'WEB EGG',
  siteurl: 'https://blog.leko.jp',
  catchcopy: 'まだまだひよこ。サバクラ問わずwebに関連することを書き留めています',
  email: 'leko.noor@gmail.com',
  author: 'れこ',
  bio: 'サイト移転しました。いまどきブックマークあるのかわかりませんがURLの更新をお願いします',
  twitter: 'L_e_k_o',
  facebook: 'shingo.inoue.967',
  facebook_app_id: '1434873820060880',
  github: 'Leko',
  qiita: 'L_e_k_o',
}
config[:date_format] = '%Y-%m-%d'
config[:similar_posts] = 5

# Per-page layout changes:
#
# With no layout
page '/*.xml', layout: false
page '/*.json', layout: false
page '/*.txt', layout: false
page "/feed.xml", layout: false
page "/google4d18b7e4a790d37f.html", layout: false, directory_index: false

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

###
# Renderers
###
set :markdown_engine, :redcarpet
set :markdown, {
  autolink:            true,
  space_after_headers: true,
  superscript:         true,
  strikethrough:       true,
  tables:              true,
  fenced_code_blocks:  true,
  footnotes:           true,
  with_toc_data:       true,
  smartypants:         false, # https://www.movabletype.jp/documentation/mt6/compose/text-format.html
  no_intra_emphasis:   true,  # http://blog.willnet.in/entry/20110828/1314552937
}

###
# Extensions
###
activate :dotenv
activate :directory_indexes
activate :blog do |blog|
  # This will add a prefix to all links, template references and source paths
  # blog.prefix = "blog"

  blog.permalink = "post/{title}/index.html"
  # Matcher for blog source files
  blog.sources = "post/{year}-{month}-{day}-{title}.html"
  blog.taglink = "tag/{tag}.html"
  blog.layout = "layouts/article"
  blog.summary_generator = Proc.new do |article, rendered|
    rendered.split('<!--more-->').first
  end
  # blog.summary_length = 250
  # blog.year_link = "{year}.html"
  # blog.month_link = "{year}/{month}.html"
  # blog.day_link = "{year}/{month}/{day}.html"
  blog.default_extension = ".md"

  blog.tag_template = "tag.html"

  # Enable pagination
  blog.paginate = true
  blog.per_page = 8
  blog.page_link = "page/{num}"
end

activate :syntax, :line_numbers => false
activate :similar

set :url_root, config[:meta][:siteurl]
activate :search_engine_sitemap, {
  default_change_frequency: 'weekly'
}

activate :external_pipeline, {
  name: :webpack,
  command: build? ?
    "NODE_ENV=production npm run build" :
    "NODE_ENV=develop npm run develop",
  source: ".tmp/dist",
  latency: 1
}

###
# Helpers
###
helpers do
  def avatar_url
    "https://www.gravatar.com/avatar/#{Digest::MD5.hexdigest(config[:meta][:email])}?size=600"
  end

  def gh_embed (url, lang = nil)
    uri = URI.parse(url)
    # https://github.com/gaearon/redux-thunk/blob/4f96ec0239453623adde857b7e7ad8c4f2897bf1/src/index.js
    owner, repo, _, sha_or_branch, *path = uri.path.split('/')[1..-1]
    lang = lang ||= File.extname(path.last)[1..-1]
    start_line, end_line = uri.fragment&.match(/L(\d+)-L(\d+)/)&.to_a&.map(&:to_i)&.drop(1) || [1, -1]
    raw_url = URI.parse("https://github.com/#{owner}/#{repo}/raw/#{sha_or_branch}/#{path.join('/')}")
    res = Net::HTTP.get_response(raw_url)
    res = case res
      when Net::HTTPRedirection then Net::HTTP.get_response(URI.parse(res['location']))
      else res
    end
    "```#{lang}?line_numbers=true&start_line=#{start_line}\n#{res.body.lines.slice((start_line-1)..end_line).join('')}\n```\n\n> &mdash; [#{url}](#{url})\n\n"
  end

  def google_linked_data_base
    {
      '@context' => 'http://schema.org',
      '@type' => 'WebSite',
      'name' => config[:meta][:sitename],
      'url' => config[:meta][:siteurl]
    }
  end

  # List article by tag
  def google_linked_data_tag(tagname, page_number)
    [google_linked_data_base, {
      '@context' => 'http://schema.org',
      '@type' => 'BreadcrumbList',
      'itemListElement' => [{
        '@type' => 'ListItem',
        'position' => 1,
        'item' => {
          '@id' => config[:meta][:siteurl],
          'name' => 'Post'
        }
      }, {
        '@type' => 'ListItem',
        'position' => 2,
        'item' => {
          'name' => 'Tag'
        }
      }, {
        '@type' => 'ListItem',
        'position' => 3,
        'item' => {
          '@id' => "#{config[:meta][:siteurl]}#{tag_path(tagname)}",
          'name' => "#{tagname}"
        }
      }, {
        '@type' => 'ListItem',
        'position' => 4,
        'item' => {
          'name' => "Page #{page_number}"
        }
      }]
    }]
  end

  # Single article
  def google_linked_data_article(article)
    if article.data.image.present?
      eyecatch_url = "#{config[:meta][:siteurl]}#{article.data.image}"
      eyecatch_width, eyecatch_height = FastImage.size(File.join(__dir__, 'source', article.data.image)) || []
    else
      eyecatch_url = avatar_url
      eyecatch_width, eyecatch_height = FastImage.size(avatar_url)
    end
    avatar_width, avatar_height = FastImage.size(avatar_url)
    [google_linked_data_base, {
      '@context': 'http://schema.org',
      '@type': 'NewsArticle',
      'headline': article.title[0...110],
      'image': {
        '@type': 'ImageObject',
        'url': eyecatch_url,
        'height': eyecatch_height,
        'width': eyecatch_width,
      },
      # Non-AMP: Ignored
      'mainEntityOfPage': {
        '@type': 'WebPage',
        '@id': "#{config[:meta][:siteurl]}#{article.data.path}",
      },
      'description': strip_tags(article.summary),
      'datePublished': article.date.strftime('%Y-%m-%dT%T%:z'),
      'dateModified': (article.data.updated_at || article.date).strftime('%Y-%m-%dT%T%:z'),
      'author': {
        '@type': 'Person',
        'name': config[:meta][:author],
      },
      'publisher': {
        '@type': 'Organization',
        'name': config[:meta][:author],
        'logo': {
          '@type': 'ImageObject',
          'url': avatar_url,
          'width': avatar_width,
          'height': avatar_height,
        }
      },
    }]
  end

  # List article
  def google_linked_data_list(current_page, page_number)
    [google_linked_data_base, {
      '@context' => 'http://schema.org',
      '@type' => 'BreadcrumbList',
      'itemListElement' => [{
        '@type' => 'ListItem',
        'position' => 1,
        'item' => {
          '@id' => config[:meta][:siteurl],
          'name' => 'Post'
        }
      }, {
        '@type' => 'ListItem',
        'position' => 2,
        'item' => {
          '@id' => "#{config[:meta][:siteurl]}#{current_page.url}",
          'name' => "Page #{page_number}"
        }
      }]
    }]
  end

  def all_articles
    blog.articles.map{|post|
      {
        objectID: Digest::MD5.hexdigest(post.slug),
        title: post.title,
        date: post.date,
        body: strip_tags(post.body),
        summary: strip_tags(post.summary),
        tags: post.tags,
        published: post.published?,
        locale: post.locale,
        slug: post.slug,
        path: post.data.path,
      }
    }
  end
end

###
# Environment specific configuration
###
configure :development do
  # activate :livereload
end

configure :build do
  activate :minify_css
  activate :minify_html

  after_build do
    def update_search_index(path)
      Algolia.init application_id: ENV['ALGOLIA_APP_ID'], api_key: ENV['ALGOLIA_API_KEY']
      index = Algolia::Index.new(ENV['ALGOLIA_INDEX'])
      index.set_settings(attributeForDistinct: 'title')
      items = JSON.parse(File.read(path))
      batch = items.flat_map {|item|
        item['body']
          .each_char
          .each_slice(1000)
          .map(&:join)
          .map.with_index{|chunk, index|
            item.merge({
              'objectID' => "#{item['objectID']}-#{index}",
              'body' => chunk
            })
          }
      }
      index.save_objects!(batch)
      File.delete(path)
    end

    def optimize_images(base)
      opts = {
        :skip_missing_workers => true, # Skip workers with missing or problematic binaries _(defaults to `false`)_
        :verbose => true,              # Verbose output _(defaults to `false`)_
        :allow_lossy => true,          # Allow lossy workers and optimizations _(defaults to `false`)_
        :cache_dir => '.caches/.imageoptim_cache',

        # PNG では OptiPNG または PNGOUT をおすすめします。
        # https://developers.google.com/speed/docs/insights/OptimizeImages
        :advpng         => false,
        :optipng        => { level: 7, interlace: false, strip: true },
        :pngcrush       => false,
        :pngout         => false,
        :pngquant       => false,

        # Best of JPEG optimization: http://qiita.com/kaibadash@github/items/4d4732ba5c25a4e49da7
        :jpegoptim      => { strip: ['all'], allow_lossy: true, max_quality: 80 },
        :jpegtran       => false,
        :jhead          => false,
        :jpegrecompress => false,

        :gifsicle       => { interlace: false },

        :svgo           => false,
      }
      image_optim = ImageOptim.new(opts)
      files = Dir.glob("#{base}/**/*")
        .reject {|p| File.directory?(p) || %w(. ..).include?(File.basename(p))}
        .select {|p| image_optim.optimizable?(p)}
        .select {|p| Digest::MD5.file(p).to_s == Digest::MD5.file(p.gsub('/build/', '/source/')).to_s}
      image_optim.optimize_images!(files)
    end

    if ENV['RAILS_ENV'] == 'production'
      optimize_images('./build/images/')
    end
    update_search_index('./build/posts.json')
  end
end
