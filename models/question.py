from odoo import models, fields, api



class SurveyQuestion(models.Model):
    _inherit = "survey.question"

    type = fields.Selection([
        ('free_text', 'Multiple Lines Text Box'),
        ('textbox', 'Single Line Text Box'),
        ('numerical_box', 'Numerical Value'),
        ('date', 'Date'),
        ('datetime', 'Datetime'),
        ('simple_choice', 'Multiple choice: only one answer'),
        ('multiple_choice', 'Multiple choice: multiple answers allowed'),
        ('matrix', 'Matrix'),
        ('gps', 'GPS'),
        ('audio', "Record Audio")], string='Question Type')

    def validate_gps(self, post, answer_tag):
        self.ensure_one()
        errors = {}
        # Empty answer to mandatory self
        if self.constr_mandatory and not post.get(answer_tag, "").strip():
            errors.update({answer_tag: self.constr_error_msg})

        return errors

    def validate_audio(self, post, answer_tag):
        self.ensure_one()
        errors = {}
        # Empty answer to mandatory self
        if self.constr_mandatory and not post.get(answer_tag, "").strip():
            errors.update({answer_tag: self.constr_error_msg})
        return errors

