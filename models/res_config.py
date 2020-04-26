from odoo import models, fields, api


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"


    google_api_key = fields.Char(
        string = "Google Api Key"
    )

    @api.model
    def get_values(self):
        res = super(ResConfigSettings, self).get_values()
        res.update(
            google_api_key = self.env['ir.config_parameter'].sudo().get_param('survey_asl_question.google_api_key'),
        )
        return res

    @api.multi
    def set_values(self):
        super(ResConfigSettings, self).set_values()
        param = self.env['ir.config_parameter'].sudo()

        api_key = self.google_api_key

        param.set_param('survey_asl_question.google_api_key', api_key)
