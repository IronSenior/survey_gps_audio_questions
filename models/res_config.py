from odoo import models, fields


class ResConfigSettings(models.TransientModel):
    _inherit = "res.config.settings"


    google_api_key = fields.Char(
        string = "Google Api Key"
    )