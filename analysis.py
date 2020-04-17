# first, we need to import our essentia module. It is aptly named 'essentia'!
import essentia

# as there are 2 operating modes in essentia which have the same algorithms,
# these latter are dispatched into 2 submodules:
import essentia.standard
import essentia.streaming

# let's have a look at what is in there
print(dir(essentia.standard))

# you can also do it by using autocompletion in IPython, typing "essentia.standard." and pressing Tab