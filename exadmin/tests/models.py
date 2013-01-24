from django.db import models

class ModelA(models.Model):
    name = models.CharField(max_length=64)
    description = models.TextField()    
    create_time = models.DateField()

    def __unicode__(self):
        return self.name
        
    class Meta:
        verbose_name = u"TestModelA"
        verbose_name_plural = verbose_name

