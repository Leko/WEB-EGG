###
# Page options, layouts, aliases and proxies
###
activate :dotenv

Algolia.init application_id: ENV['ALGOLIA_APP_ID'], api_key: ENV['ALGOLIA_API_KEY']

config[:meta] = {
  locale: 'ja',
  sitename: '[WIP] WEB EGG',
  siteurl: 'https://blog.leko.jp',
  catchcopy: 'Work in progress...',
  email: 'leko.noor@gmail.com',
  author: 'れこ',
  bio: 'サイト移転しました。いまどきブックマークあるのかわかりませんがURLの更新をお願いします',
  twitter: 'L_e_k_o',
  facebook: 'shingo.inoue.967',
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

# With alternative layout
# page "/path/to/file.html", layout: :otherlayout

# Proxy pages (http://middlemanapp.com/basics/dynamic-pages/)
# proxy "/this-page-has-no-template.html", "/template-file.html", locals: {
#  which_fake_page: "Rendering a fake page with a local variable" }

###
# Helpers
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
  blog.per_page = 15
  blog.page_link = "page/{num}"
end

activate :syntax, :line_numbers => false
activate :similar

set :url_root, config[:meta][:siteurl]
activate :search_engine_sitemap

activate :external_pipeline, {
  name: :webpack,
  command: build? ?
    "npm run build" :
    "npm run develop",
  source: ".tmp/dist",
  latency: 1
}

page "/feed.xml", layout: false
# Reload the browser automatically whenever files change
# configure :development do
#   activate :livereload
# end

# Methods defined in the helpers block are available in templates
helpers do
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

# Build-specific configuration
configure :build do
  # Minify CSS on build
  # activate :minify_css

  # Minify Javascript on build
  # activate :minify_javascript

  after_build do
    index = Algolia::Index.new(ENV['ALGOLIA_INDEX'])
    batch = JSON.parse(File.read('./build/posts.json'))
    index.save_objects!(batch)
    File.delete('./build/posts.json')
  end
end
