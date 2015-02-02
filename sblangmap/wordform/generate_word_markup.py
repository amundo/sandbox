# -*- coding: utf-8 -*-
import codecs, sys

sys.stdout = codecs.getwriter('utf-8')(sys.stdout)

keywords = open('words.txt').read().decode('utf-8')
keywords = [w.strip() for w in keywords.splitlines()]

prolog = open('template_prolog.html').read().decode('utf-8')
postlog = open('template_postlog.html').read().decode('utf-8')

template = u"""
<div class=wordform id="{keyword}">
	<form class="col-md-8 form-horizontal">
	  <fieldset>
	    <div class="form-group">
              <h2>{keyword}</h2>
	    </div>
	    <div class="form-group">
	      <label for="inputOrthographic" class="col-lg-2 control-label">Orthographic</label>
	      <div class="col-lg-10">
	        <input class="inputOrthographic form-control" placeholder="Orthographic">
	      </div>
	    </div>
	    <div class="form-group">
	      <label for="inputPhonetic" class="col-lg-2 control-label">Phonetic</label>
	      <div class="col-lg-10">
	        <input class="inputPhonetic form-control" placeholder="Phonetic">
	      </div>
	    </div>
	    <div class="form-group">
	      <label for="inputGloss" class="col-lg-2 control-label">Gloss</label>
	      <div class="col-lg-10">
	        <input class="inputGloss form-control" placeholder="Gloss">
	      </div>
	    </div>
	    <div class="form-group">
	      <label for="textArea" class="col-lg-2 control-label">Comment</label>
	      <div class="col-lg-10">
	        <textarea class="comment form-control" rows="3"></textarea>
	        <span class="help-block">Anything else you’d like to share about this word?</span>
	      </div>
	    </div>
	  </fieldset>
	</form>
</div>
"""

print prolog
for keyword in keywords:
  print template.format(keyword=keyword)
print postlog

