require 'uri'
require 'json'
require 'typhoeus'

desc 'Compare Google PageSpeed Insights'
task :psi, ['from', 'to'] do |t, args|
	STRATEGIES = %w(mobile desktop)
	COMPARE_KEYS = [
		%i(ruleGroups SPEED score),
		%i(ruleGroups USABILITY score),
		%i(pageStats numberResources),
		%i(pageStats numberHosts),
		%i(pageStats totalRequestBytes),
		%i(pageStats htmlResponseBytes),
		%i(pageStats cssResponseBytes),
		%i(pageStats imageResponseBytes),
		%i(pageStats javascriptResponseBytes),
		%i(pageStats numberJsResources),
		%i(pageStats numberCssResources),
		# %i(formattedResults ruleResults AvoidLandingPageRedirects),
	]
	domain_from = URI.parse(args.from).host
	domain_to = URI.parse(args.to).host

	STRATEGIES.each do |strategy|
		response_from = Typhoeus.get("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=#{args.from}&strategy=#{strategy}")
		response_to = Typhoeus.get("https://www.googleapis.com/pagespeedonline/v2/runPagespeed?url=#{args.to}&strategy=#{strategy}")
		result_from = JSON.parse(response_from.body, symbolize_names: true)
		result_to = JSON.parse(response_to.body, symbolize_names: true)
		puts "### #{strategy}"
		puts "|Name|#{domain_from}|#{domain_to}|Diff|"
		puts '|---|---|---|---|'
		COMPARE_KEYS.each do |path|
			score_from = result_from.dig(*path).to_i
			score_to = result_to.dig(*path).to_i
			score_operator = score_to - score_from > 0 ? '+' : ''
			puts "|#{path.join('.')}|#{score_from}|#{score_to}|#{score_operator}#{score_to - score_from}|"
		end
		puts
	end
end
